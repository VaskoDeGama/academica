'use strict'

const ExpressServer = require('./configs/express-server')
const DataBase = require('./configs/database')
const signals = require('./utils/signals')
const config = require('config')

const db = new DataBase(config.db)
const server = new ExpressServer(config.server.port)

const shutdown = signals.init(async () => {
  await db.close()
  await server.close()
});

(async () => {
  try {
    await db.connect()
    await server.start()
  } catch (error) {
    await shutdown()
  }
})()

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
