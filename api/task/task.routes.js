import express from 'express'
import { addTask, removeTask, updateTask, updateTasks } from './task.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const taskRoutes = express.Router()

// taskRoutes.get('/', getTasks)
taskRoutes.post('/', requireAuth, addTask)
taskRoutes.put('/', requireAuth, updateTask)
taskRoutes.put('/swap/', requireAuth, updateTasks)
taskRoutes.delete('/:boardId/:groupId/:taskId', requireAuth, removeTask)
