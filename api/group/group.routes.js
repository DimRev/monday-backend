import express from 'express'
import { addGroup, removeGroup, updateGroup } from './group.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const groupRoutes = express.Router()

// groupRoutes.get('/', getGroups)
groupRoutes.post('/', requireAuth, addGroup)
groupRoutes.put('/', requireAuth, updateGroup)
groupRoutes.delete('/:boardId/:groupId', requireAuth, removeGroup)
