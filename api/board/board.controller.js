import { loggerService } from "../../services/logger.service.js";
import { boardService } from "./board.service.js"

export async function getBoards(req, res){
  try {
    loggerService.debug('**Getting boards**')
    const boards = await boardService.query()
    res.send(boards)
  } catch (err) {
    loggerService.error('B.C | Error getting boards ', err)
    res.status(400).send('Could not get boards')
  }
}

export async function addBoard(req,res){
  const { board } = req.body
  const boardToAdd = board
  try {
    const addedBoard = await boardService.add(boardToAdd)
    res.send(addedBoard)
  } catch (err) {
    loggerService.error('B.C | Error adding board ', err)
    res.status(400).send('Could not add board')
  }
}

export async function updateBoard(req,res){
  const { board } = req.body
  const boardToUpdate = board
  try {
    const updatedBoard = await boardService.update(boardToUpdate)
    res.send(updatedBoard)
  } catch (err) {
    loggerService.error('B.C | Error adding board ', err)
    res.status(400).send('Could not update board')
  }
}

export async function removeBoard(req,res){
  const boardId = req.params.boardId
  console.log(boardId)
  try {
    await boardService.remove(boardId)
    res.send(boardId)
  } catch (err) {
    loggerService.error('B.C | Error removing board ', err)
    res.status(400).send('Could not remove board')
  }
}