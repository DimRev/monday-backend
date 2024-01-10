import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'


import { loggerService } from './services/logger.service.js'
loggerService.info('server.js loaded...')

const app = express()

//Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


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
app.use('/api/board', boardRoutes)


const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
