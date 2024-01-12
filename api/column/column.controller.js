import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { columnService } from './column.service.js'

// export async function getColumns(req, res) {
//   try {
//     loggerService.debug('**Getting columns**')
//     const columns = await columnService.query()
//     res.send(columns)
//   } catch (err) {
//     loggerService.error('B.C | Error getting columns ', err)
//     res.status(400).send('Could not get columns')
//   }
// }

export async function addColumn(req, res) {
  const { boardId, column } = req.body
  const columnToAdd = column
  const user = req.loggedinUser
  try {
    const addedColumn = await columnService.add(boardId, columnToAdd)
    socketService.broadcast({
      type: 'add-column',
      data: { boardId, addedColumn },
      room: boardId,
      userId: user._id,
    })
    res.send(addedColumn)
  } catch (err) {
    loggerService.error('B.C | Error adding column ', err)
    res.status(400).send('Could not add column')
  }
}

export async function updateColumn(req, res) {
  const { boardId, columnId, column } = req.body
  const columnToUpdate = column
  const user = req.loggedinUser
  try {
    const updatedColumn = await columnService.update(
      boardId,
      columnId,
      columnToUpdate
    )
    socketService.broadcast({
      type: 'update-column',
      data: { boardId, columnId, updatedColumn },
      room: boardId,
      userId: user._id,
    })
    res.send(updatedColumn)
  } catch (err) {
    loggerService.error('B.C | Error adding column ', err)
    res.status(400).send('Could not update column')
  }
}

export async function removeColumn(req, res) {
  const { boardId, columnId } = req.params
  const user = req.loggedinUser
  try {
    await columnService.remove(boardId, columnId)
    socketService.broadcast({
      type: 'remove-column',
      data: { boardId, columnId },
      room: boardId,
      userId: user._id,
    })
    res.send(columnId)
  } catch (err) {
    loggerService.error('B.C | Error removing column ', err)
    res.status(400).send('Could not remove column')
  }
}
