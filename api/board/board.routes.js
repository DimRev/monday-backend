import express from "express";
import { addBoard, getBoards, removeBoard, updateBoard, updateBoards } from "./board.controller.js";

export const boardRoutes = express.Router()

boardRoutes.get('/', getBoards)
boardRoutes.post('/', addBoard)
boardRoutes.put('/', updateBoard)
boardRoutes.put('/boards/', updateBoards)
boardRoutes.delete('/:boardId', removeBoard)
