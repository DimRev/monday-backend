import { ObjectId } from "mongodb"

import { utilService } from "../../services/utils.service.js"
import { loggerService } from "../../services/logger.service.js"
import { dbService } from "../../services/db.service.js"

export const boardService = {
  query
}

async function query() {

  console.log('test')
  // try {
  // const collection = await dbService.getCollection('board')
  // const boards = collection.find().toArray()
  // return boards
  // } catch (err) {
  //   loggerService.error('B.S | Could not find boards')
  // }
}