import { ObjectId } from 'mongodb'

import { utilService } from '../../services/utils.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const boardService = {
  query,
  getById,
  add,
  update,
  updateAll,
  remove,
}

async function query() {
  try {
    const collection = await dbService.getCollection('board')
    const boards = collection.find().toArray()
    return boards
  } catch (err) {
    loggerService.error('B.S | Could not find boards', err)
    throw err
  }
}

async function getById(boardId){
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.find({_id: new ObjectId(boardId)}).toArray()
    return board
  } catch (err) {
    loggerService.error('B.S | Could not find board', err)
  }
}

async function add(board) {
  const boardToAdd = {
    title: board.title || '',
    createdBy: board.createdBy || {},
    labelsdef1: board.labelsdef1 || [],
    members: board.members || [],
    groups: board.groups || [],
    activities: board.activities || [],
    cmpsOrder: board.cmpsOrder || [],
    option: board.option || '',
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
    title: board.title || '',
    createdBy: board.createdBy || {},
    labelsdef1: board.labelsdef1 || [],
    members: board.members || [],
    groups: board.groups || [],
    activities: board.activities || [],
    cmpsOrder: board.cmpsOrder || [],
    ...board
  }
  // console.log(boardToUpdate)
  delete boardToUpdate._id;
  try {
    const collection = await dbService.getCollection('board')
    await collection.updateOne(
      { _id: new ObjectId(board._id) },
      { $set: boardToUpdate }
    )
    boardToUpdate._id = board._id
    return boardToUpdate
  } catch (err) {
    loggerService.error('B.S | Could not update board', err)
    throw err
  }
}

async function updateAll(boards) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteMany({})

    const boardsToAdd = boards.map((board) => {
      return { ...board, _id: new ObjectId(board._id) }
    })
    const result = await collection.insertMany(boardsToAdd)
    return boardsToAdd
  } catch (err) {
    loggerService.error('B.S | Could not replace all boards', err)
    throw err
  }
}

async function remove(boardId) {
  try {
    if (!boardId) throw `missing boardId : ${boardId}`
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: new ObjectId(boardId) })
  } catch (err) {
    loggerService.error(`B.S | Could not remove boards ${boardId}`, err)
    throw err
  }
}
