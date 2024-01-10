import { loggerService } from "../../services/logger.service.js";
import { boardService } from "./board.service.js"

export async function getBoards(req, res){

  try {
    loggerService.debug('**Getting boards**')
    const boards = await boardService.query()
    res.send(boards)
  } catch (err) {
    loggerService.error('B.C | Error getting boards ', err)
    res.status(400).send('Could not get board')
  }
}