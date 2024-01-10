import express from "express";
import { getBoards } from "./board.controller.js";

export const boardRoutes = express.Router()

boardRoutes.get('/', getBoards)