const cors = require('cors')
const config = require('config')
const express = require('express')
const { json, urlencoded } = require('body-parser')
const { middleware: httpContext } = require('express-http-context')
const { logger, setupLogging } = require('../utils/logger')
const { setMetrics, globalErrorHandler, finalMiddleware } = require('../middleware')
const { pingRouter, apiRouter } = require('../routes')
const getDatabaseClient = require('./db-connect.js')

class ExpressServer {
  constructor () {
    this.dbClient = null
    this.server = null

    this.app = express()

    setupLogging(this.app)
    this.app.disable('x-powered-by')
    this.app.use(cors())
    this.app.use(json({ limit: '10mb' }))
    this.app.use(urlencoded({ extended: true }))
    this.app.use(httpContext)
    this.app.use(setMetrics)

    this.app.use(pingRouter)
    this.app.use('/api', apiRouter)

    this.app.use(finalMiddleware)
    this.app.use(globalErrorHandler)
  }

  start () {
    const port = config.get('Server.port')
    const dbConfig = config.get('DataBase')

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, async () => {
        logger.info(`Server Started! http://localhost:${port}, pid: ${process.pid}`)
        try {
          this.dbClient = await getDatabaseClient(dbConfig.url, dbConfig.dbName)
          logger.info('DataBase connect successful.')
        } catch (e) {
          logger.error('Start failed', e.message)
          reject(e)
        }
        resolve(this)
      })
    })
  }

  async stop () {
    if (this.server) {
      await this.server.close()
    }

    if (this.dbClient) {
      await this.dbClient.disconnect()
    }
    logger.info('Server stopped.')
    return this
  }
}

module.exports = ExpressServer
