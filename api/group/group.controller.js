import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { utilService } from '../../services/utils.service.js'
import { groupService } from './group.service.js'

export async function addGroup(req, res) {
  const { boardId, group } = req.body
  const groupToAdd = { ...group }
  const user = req.loggedinUser

  try {
    const addedGroup = await groupService.add(boardId, groupToAdd)
    socketService.broadcast({
      type: 'add-group',
      data: { boardId, group: addedGroup },
      room: boardId,
      userId: user._id,
    })
    res.send(addedGroup)
  } catch (err) {
    loggerService.error('B.C | Error adding group ', err)
    res.status(400).send('Could not add group')
  }
}

export async function updateGroup(req, res) {
  const { boardId, groupId, group } = req.body
  const groupToUpdate = { ...group }
  const user = req.loggedinUser

  try {
    const updatedGroup = await groupService.update(
      boardId,
      groupId,
      groupToUpdate
    )
    socketService.broadcast({
      type: 'update-group',
      data: { boardId, groupId, group: updatedGroup },
      room: boardId,
      userId: user._id,
    })
    res.send(updatedGroup)
  } catch (err) {
    loggerService.error('B.C | Error adding group ', err)
    res.status(400).send('Could not update group')
  }
}

export async function removeGroup(req, res) {
  const { boardId, groupId } = req.params
  const user = req.loggedinUser
  try {
    await groupService.remove(boardId, groupId)
    socketService.broadcast({
      type: 'remove-group',
      data: { boardId, groupId },
      room: boardId,
      userId: user._id,
    })
    res.send(groupId)
  } catch (err) {
    loggerService.error('B.C | Error removing group ', err)
    res.status(400).send('Could not remove group')
  }
}
