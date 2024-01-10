import express from "express";
import { addTask, removeTask, updateTask } from "./task.controller.js";

export const taskRoutes = express.Router()

// taskRoutes.get('/', getTasks)
taskRoutes.post('/', addTask)
taskRoutes.put('/', updateTask)
taskRoutes.delete('/:boardId/:groupId/:taskId', removeTask)
