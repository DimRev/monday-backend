import { ObjectId } from 'mongodb'

import { utilService } from '../../services/utils.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const taskService = {
  // query,
  add,
  update,
  remove,
}

async function add(boardId, groupId, task, at) {
  const taskToAdd = {
    title: task.title,
    activity: [],
  }
  taskToAdd.id = utilService.makeId()
  try {
    if (!boardId) throw `missing boardId : ${boardId}`
    if (!groupId) throw `missing groupId : ${groupId}`

    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId), 'groups.id': groupId },
      at === 'last'
        ? { $push: { 'groups.$.tasks': taskToAdd } }
        : { $push: { 'groups.$.tasks': { $each: [taskToAdd], $position: 0 } } }
    )
    if (result.matchedCount === 0)
      throw `Could not add task to GroupId[${groupId}] in BoardId[${boardId}]`
    return taskToAdd
  } catch (err) {
    loggerService.error('B.S | Could not add task', err)
    throw err
  }
}

async function update(boardId, groupId, taskId, task) {
  const taskToUpdate = {
    ...task,
    title: task.title,
    id: task.id,
  }
  try {
    if (!boardId) throw `missing boardId : ${boardId}`
    if (!groupId) throw `missing groupId : ${groupId}`
    if (!taskId) throw `missing taskId : ${taskId}`
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      {
        _id: new ObjectId(boardId),
        'groups.id': groupId,
        'groups.tasks.id': taskId,
      },
      {
        $set: { 'groups.$[group].tasks.$[task]': taskToUpdate },
      },
      {
        arrayFilters: [{ 'group.id': groupId }, { 'task.id': taskId }],
      }
    )
    if (result.matchedCount === 0)
      throw `Could not update TaskId[${taskId}] in GroupId[${groupId}] of BoardId[${boardId}]`
    return taskToUpdate
  } catch (err) {
    loggerService.error('B.S | Could not update task', err)
    throw err
  }
}

async function remove(boardId, groupId, taskId) {
  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.updateOne(
      { _id: new ObjectId(boardId), 'groups.id': groupId },
      { $pull: { 'groups.$.tasks': { id: taskId } } }
    )
    if (result.modifiedCount === 0)
      throw `Could not remove TaskId[${taskId}] in GroupId[${groupId}] from BoardId[${boardId}]`
    return taskId
  } catch (err) {
    loggerService.error(
      `B.S | Could not remove task ${taskId} from group ${groupId} in board ${boardId}`,
      err
    )
    throw err
  }
}
