import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res) {
  const userId = req.loggedinUser
  try {
    loggerService.debug('**Getting boards**')
    const boards = await boardService.query()
    res.send(boards)
  } catch (err) {
    loggerService.error('B.C | Error getting boards ', err)
    res.status(400).send('Could not get boards')
  }
}

export async function getBoard(req, res) {
  const {boardId} = req.params
  try {
    const board = await boardService.getById(boardId)
    res.send(board)
  } catch (err) {
    loggerService.error('B.C | Error getting board', err)
    res.status(400).send('Could not get board')
  }
}

export async function addBoard(req, res) {
  const board = req.body
  const boardToAdd = board
  const user = req.loggedinUser
  console.log(user)
  try {
    const addedBoard = await boardService.add(boardToAdd)
    socketService.broadcast({
      type: 'add-board',
      data: { addedBoard },
      userId: user._id,
    })
    res.send(addedBoard)
  } catch (err) {
    loggerService.error('B.C | Error adding board ', err)
    res.status(400).send('Could not add board')
  }
}

export async function updateBoard(req, res) {
  const board = req.body
  const boardToUpdate = board
  const user = req.loggedinUser
  try {
    const updatedBoard = await boardService.update(boardToUpdate)
    socketService.broadcast({
      type: 'update-board',
      data: { updatedBoard },
      userId: user._id,
    })
    res.send(updatedBoard)
  } catch (err) {
    loggerService.error('B.C | Error update board ', err)
    res.status(400).send('Could not update board')
  }
}

export async function updateBoards(req, res) {
  const boardsToUpdate = [...req.body]
  try {
    const updatedBoards = await boardService.updateAll(boardsToUpdate)
    res.send(updatedBoards)
  } catch (err) {
    loggerService.error('B.C | Error adding boards ', err)
    res.status(400).send('Could not update boards')
  }
}

export async function removeBoard(req, res) {
  const boardId = req.params.boardId
  const user = req.loggedinUser
  try {
    await boardService.remove(boardId)
    socketService.broadcast({
      type: 'remove-board',
      data: { boardId },
      userId: user._id,
    })
    res.send(boardId)
  } catch (err) {
    loggerService.error('B.C | Error removing board ', err)
    res.status(400).send('Could not remove board')
  }
}
