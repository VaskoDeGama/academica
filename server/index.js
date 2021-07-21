'use strict'
require('dotenv').config()

const Server = require('./server')
const router = require('./router')
const Logger = require('./logger')
const { delay } = require('./utils')

const serverLogger = new Logger({
  consolePrefix: () => `[${new Date(Date.now() + 180 * 60000).toISOString().replace('T', ' ').replace('Z', '')}][Server]`
})

/** @type {number} */
const PORT = process.env.PORT || 3000

const app = new Server()

app.use(async (req, res, next) => {
  await delay(1000, 2000)
  serverLogger.log('info', `Req: ${req.method} : url: ${req.url}`)
  next()
})
app.use(router)
app.listen(PORT, () => serverLogger.log('info', 'Server started on port:', PORT))
