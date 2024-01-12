import express from 'express'
import { addColumn, removeColumn, updateColumn } from './column.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const columnRoutes = express.Router()

// columnRoutes.get('/', getColumns)
columnRoutes.post('/', requireAuth, addColumn)
columnRoutes.put('/', requireAuth, updateColumn)
columnRoutes.delete('/:boardId/:columnId', requireAuth, removeColumn)
