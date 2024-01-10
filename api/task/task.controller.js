import { loggerService } from '../../services/logger.service.js'
import { taskService } from './task.service.js'

// export async function getTasks(req, res) {
//   try {
//     loggerService.debug('**Getting tasks**')
//     const tasks = await columnService.query()
//     res.send(tasks)
//   } catch (err) {
//     loggerService.error('B.C | Error getting tasks ', err)
//     res.status(400).send('Could not get tasks')
//   }
// }

export async function addTask(req, res) {
  const { boardId, groupId, task } = req.body
  const taskToAdd = task
  try {
    const addedTask = await taskService.add(boardId, groupId, taskToAdd)
    res.send(addedTask)
  } catch (err) {
    loggerService.error('B.C | Error adding task ', err)
    res.status(400).send('Could not add task')
  }
}

export async function updateTask(req, res) {
  const { boardId, groupId, taskId, task } = req.body
  const taskToUpdate = task
  try {
    const updatedTask = await taskService.update(
      boardId,
      groupId,
      taskId,
      taskToUpdate
    )
    res.send(updatedTask)
  } catch (err) {
    loggerService.error('B.C | Error adding task ', err)
    res.status(400).send('Could not update task')
  }
}

export async function removeTask(req, res) {
  const { boardId, groupId, taskId } = req.params
  try {
    await taskService.remove(boardId, groupId, taskId)
    res.send(taskId)
  } catch (err) {
    loggerService.error('B.C | Error removing task ', err)
    res.status(400).send('Could not remove task')
  }
}
