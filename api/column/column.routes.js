import express from "express";
import { addColumn, getColumns, removeColumn, updateColumn } from "./column.controller.js";

export const columnRoutes = express.Router()

// columnRoutes.get('/', getColumns)
columnRoutes.post('/', addColumn)
columnRoutes.put('/', updateColumn)
columnRoutes.delete('/:boardId/:columnId', removeColumn)
