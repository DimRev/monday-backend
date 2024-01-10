import express from "express";
import { addGroup, removeGroup, updateGroup } from "./group.controller.js";

export const groupRoutes = express.Router()

// groupRoutes.get('/', getGroups)
groupRoutes.post('/', addGroup)
groupRoutes.put('/', updateGroup)
groupRoutes.delete('/:boardId/:groupId', removeGroup)
