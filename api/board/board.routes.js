import express from "express";
import { addBoard, getBoards, removeBoard, updateBoard } from "./board.controller.js";

export const boardRoutes = express.Router()

boardRoutes.get('/', getBoards)
boardRoutes.post('/', addBoard)
boardRoutes.put('/', updateBoard)
boardRoutes.delete('/:boardId', removeBoard)
