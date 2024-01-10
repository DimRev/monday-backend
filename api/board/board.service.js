import { ObjectId } from 'mongodb'

import { utilService } from '../../services/utils.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const boardService = {
  query,
  add,
  update,
  remove,
}

async function query() {
  console.log('test')
  try {
    const collection = await dbService.getCollection('board')
    const boards = collection.find().toArray()
    return boards
  } catch (err) {
    loggerService.error('B.S | Could not find boards', err)
    throw err
  }
}

async function add(board) {
  const boardToAdd = {
    title: board.title,
    createdBy: board.createdBy,
    labels: board.labels,
    members: board.members,
    groups: board.groups,
    activities: board.activities,
    cmpsOrder: board.cmpsOrder,
  }
  try {
    const collection = await dbService.getCollection('board')
    await collection.insertOne(boardToAdd)
    return boardToAdd
  } catch (err) {
    loggerService.error('B.S | Could not add board', err)
    throw err
  }
}

async function update(board) {
  const boardToUpdate = {
    title: board.title,
    createdBy: board.createdBy,
    labels: board.labels,
    members: board.members,
    groups: board.groups,
    activities: board.activities,
    cmpsOrder: board.cmpsOrder,
  }
  try {
    const collection = await dbService.getCollection('board')
    await collection.updateOne(
      { _id: new ObjectId(board._id) },
      { $set: boardToUpdate }
    )
    return boardToUpdate
  } catch (err) {
    loggerService.error('B.S | Could not update board', err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: new ObjectId(boardId) })
  } catch (err) {
    loggerService.error(`B.S | Could not remove boards ${boardId}`, err)
    throw err
  }
}
