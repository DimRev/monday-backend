import { loggerService } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

export function setupSocketAPI(server) {
  gIo = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    loggerService.info(`New connected socket [id: ${socket.id}]`)
    socket.on('disconnect', (socket) => {
      loggerService.info(`Socket disconnected [id: ${socket.id}]`)
    })

    socket.on('chat-set-topic', (topic) => {
      if (socket.myTopic === topic) return
      if (socket.myTopic) {
        socket.leave(socket.myTopic)
        loggerService.info(
          `Socket is leaving topic ${socket.myTopic} [id: ${socket.id}]`
        )
      }
      socket.join(topic)
      socket.myTopic = topic
    })

    socket.on('chat-send-msg', (msg) => {
      loggerService.info(
        `New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`
      )
      // emits to all sockets:
      // gIo.emit('chat addMsg', msg)
      // emits only to sockets in the same room except the sender!
      socket.broadcast.to(socket.myTopic).emit('chat-add-msg', msg)
    })

    socket.on('user-watch', (userId) => {
      loggerService.info(
        `user-watch from socket [id: ${socket.id}], on user ${userId}`
      )
      socket.join('watching:' + userId)
    })

    socket.on('set-user-socket', (userId) => {
      loggerService.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      )
      socket.userId = userId
    })

    socket.on('unset-user-socket', () => {
      loggerService.info(`Removing socket.userId for socket [id: ${socket.id}]`)
      delete socket.userId
    })

    socket.on('board-watch', (boardId) => {
      loggerService.info(`Socket joining board : ${boardId} [id: ${socket.id}]`)
      socket.join('board:' + boardId)
    })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label.toString()).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  userId = userId.toString()
  const socket = await _getUserSocket(userId)

  if (socket) {
    loggerService.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    )
    socket.emit(type, data)
  } else {
    loggerService.info(`No active socket for user: ${userId}`)
    // _printSockets()
  }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
  userId = userId.toString()

  loggerService.info(`Broadcasting event: ${type}`)
  const excludedSocket = await _getUserSocket(userId)
  if (room && excludedSocket) {
    loggerService.info(`Broadcast to room ${room} excluding user: ${userId}`)
    excludedSocket.broadcast.to(room).emit(type, data)
  } else if (excludedSocket) {
    loggerService.info(`Broadcast to all excluding user: ${userId}`)
    excludedSocket.broadcast.emit(type, data)
  } else if (room) {
    loggerService.info(`Emit to room: ${room}`)
    gIo.to(room).emit(type, data)
  } else {
    loggerService.info(`Emit to all`)
    gIo.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId === userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function _printSockets() {
  const sockets = await _getAllSockets()
  console.log(`Sockets: (count: ${sockets.length}):`)
  sockets.forEach(_printSocket)
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

export const socketService = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
}
