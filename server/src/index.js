'use strict'

const ExpressServer = require('./configs/express-server')
const DataBase = require('./configs/database')
const signals = require('./utils/signals')
const config = require('config')
const RedisClient = require('./configs/redis-client')

const db = new DataBase(config.db)
const server = new ExpressServer(config.server.port)
const redis = new RedisClient(config.redis)

const shutdown = signals.init(async () => {
  await db.close()
  await redis.close()
  await server.close()
});

(async () => {
  try {
    await db.connect()
    await redis.connect()
    await server.start()
  } catch (error) {
    await shutdown()
  }
})()

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
