import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { taskService } from './task.service.js'

export async function addTask(req, res) {
  const { boardId, groupId, task, at } = req.body
  const taskToAdd = task
  const user = req.loggedinUser
  try {
    const addedTask = await taskService.add(boardId, groupId, taskToAdd, at)
    socketService.broadcast({
      type: 'add-task',
      data: { boardId, groupId, task: addedTask },
      room: boardId,
      userId: user._id,
    })
    res.send(addedTask)
  } catch (err) {
    loggerService.error('B.C | Error adding task ', err)
    res.status(400).send('Could not add task')
  }
}

export async function updateTask(req, res) {
  const { boardId, groupId, taskId, task } = req.body
  const taskToUpdate = task
  const user = req.loggedinUser
  try {
    const updatedTask = await taskService.update(
      boardId,
      groupId,
      taskId,
      taskToUpdate
    )
    socketService.broadcast({
      type: 'update-task',
      data: { boardId, groupId, taskId, task: updatedTask },
      room: boardId,
      userId: user._id,
    })
    res.send(updatedTask)
  } catch (err) {
    loggerService.error('B.C | Error adding task ', err)
    res.status(400).send('Could not update task')
  }
}

export async function removeTask(req, res) {
  const { boardId, groupId, taskId } = req.params
  const user = req.loggedinUser
  try {
    await taskService.remove(boardId, groupId, taskId)
    socketService.broadcast({
      type: 'remove-task',
      data: { boardId, groupId, deletedTaskId: taskId },
      room: boardId,
      userId: user._id,
    })
    res.send(taskId)
  } catch (err) {
    loggerService.error('B.C | Error removing task ', err)
    res.status(400).send('Could not remove task')
  }
}
