import { ObjectId } from 'mongodb'

import { utilService } from '../../services/utils.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const columnService = {
  query,
  add,
  update,
  remove,
}

async function query() {
  console.log('test')
  try {
    const collection = await dbService.getCollection('board')
    const columns = collection.find().toArray()
    return columns
  } catch (err) {
    loggerService.error('B.S | Could not find columns', err)
    throw err
  }
}

async function add(boardId, column) {
  const columnToAdd = column
  columnToAdd.id = utilService.makeId()
  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $push: { cmpsOrder: columnToAdd } }
    )
    if (result.matchedCount === 0)
      throw `Could not add column to BoardId[${boardId}]`
    return columnToAdd
  } catch (err) {
    loggerService.error('B.S | Could not add column', err)
    throw err
  }
}

async function update(boardId, columnId, column) {
  const columnToUpdate = column
  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId), 'cmpsOrder.id': columnId },
      { $set: { 'cmpsOrder.$.title': columnToUpdate.title } }
    )
    if (result.matchedCount === 0)
      throw `Could not update ColumnId[${columnId}] in BoardId[${boardId}]`
    return columnToUpdate
  } catch (err) {
    loggerService.error('B.S | Could not update column', err)
    throw err
  }
}

async function remove(boardId, columnId) {
  console.log(boardId, columnId)
  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $pull: { cmpsOrder: { id: columnId } } }
    )
    console.log(result)
    if (result.modifiedCount === 0)
      throw `Could not remove ColumnId[${columnId}] from BoardId[${boardId}]`
    return columnId
  } catch (err) {
    loggerService.error(
      `B.S | Could not remove column ${columnId} from board ${boardId}`,
      err
    )
    throw err
  }
}
