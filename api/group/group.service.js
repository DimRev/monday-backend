import { ObjectId } from 'mongodb'

import { utilService } from '../../services/utils.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const groupService = {
  // query,
  add,
  update,
  remove,
}

// async function query() {
//   console.log('test')
//   try {
//     const collection = await dbService.getCollection('board')
//     const columns = collection.find().toArray()
//     return columns
//   } catch (err) {
//     loggerService.error('B.S | Could not find columns', err)
//     throw err
//   }
// }

async function add(boardId, group) {
  const groupToAdd = {
    id: utilService.makeId(),
    title: group.title || '',
    archivedAt: group.archivedAt || Date.now(),
    tasks: group.tasks || [],
  }
  groupToAdd.id = utilService.makeId()
  try {
    if (!boardId) throw `missing boardId : ${boardId}`

    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $push: { groups: groupToAdd } }
    )
    if (result.matchedCount === 0)
      throw `Could not add group to BoardId[${boardId}]`
    return groupToAdd
  } catch (err) {
    loggerService.error('B.S | Could not add group', err)
    throw err
  }
}

async function update(boardId, groupId, group) {
  const groupToUpdate = {
    id: group.id,
    title: group.title || '',
    archivedAt: group.archivedAt || Date.now(),
    tasks: group.tasks || [],
  }
  try {
    if (!boardId) throw `missing boardId : ${boardId}`
    if (!groupId) throw `missing groupId : ${groupId}`

    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId), 'groups.id': groupId },
      { $set: { 'groups.$': groupToUpdate } }
    )
    if (result.matchedCount === 0)
      throw `Could not update GroupId[${groupId}] in BoardId[${boardId}]`
    return groupToUpdate
  } catch (err) {
    loggerService.error('B.S | Could not update group', err)
    throw err
  }
}

async function remove(boardId, groupId) {
  console.log(boardId, groupId)
  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $pull: { groups: { id: groupId } } }
    )
    console.log(result)
    if (result.modifiedCount === 0)
      throw `Could not remove GroupId[${groupId}] from BoardId[${boardId}]`
    return groupId
  } catch (err) {
    loggerService.error(
      `B.S | Could not remove group ${groupId} from board ${boardId}`,
      err
    )
    throw err
  }
}
