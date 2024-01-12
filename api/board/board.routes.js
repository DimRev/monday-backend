import express from 'express'
import {
  addBoard,
  getBoard,
  getBoards,
  removeBoard,
  updateBoard,
  updateBoards,
} from './board.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const boardRoutes = express.Router()

boardRoutes.get('/', requireAuth, getBoards)
boardRoutes.get('/:boardId', requireAuth, getBoard)
boardRoutes.post('/', requireAuth, addBoard)
boardRoutes.put('/', requireAuth, updateBoard)
boardRoutes.put('/boards/', requireAuth, updateBoards)
boardRoutes.delete('/:boardId', requireAuth, removeBoard)
