import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'

import { loggerService } from './services/logger.service.js'
loggerService.info('server.js loaded...')

const app = express()
const server = http.createServer(app)

//Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
      origin: [   'http://127.0.0.1:3000',
                  'http://localhost:3000',
                  'http://127.0.0.1:5173',
                  'http://localhost:5173'
              ],
      credentials: true
  }
  app.use(cors(corsOptions))
}


import { boardRoutes } from './api/board/board.routes.js'
import { columnRoutes } from './api/column/column.routes.js'
import { groupRoutes } from './api/group/group.routes.js'
import { taskRoutes } from './api/task/task.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { setupSocketAPI } from './services/socket.service.js'

app.use('/api/board', boardRoutes)
app.use('/api/column', columnRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/auth', authRoutes)

setupSocketAPI(server)




const port = process.env.PORT || 3030
server.listen(port, () => {
    loggerService.info('Server is running on port: ' + port)
})
