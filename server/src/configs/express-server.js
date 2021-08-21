'use strict'

const express = require('express')
const cors = require('cors')
const { json, urlencoded } = require('body-parser')
const { middleware: httpContext } = require('express-http-context')
const { setupLogging } = require('../utils/logger')
const { setMetrics, globalErrorHandler, finalMiddleware } = require('../middleware')
const { pingRouter, apiRouter } = require('../routes')

class ExpressServer {
  /**
   *
   * @param {number} port
   */
  constructor (port = 3000) {
    this.server = null
    this.app = express()
    this.port = port

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
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, async () => {
        this.app.servLog.info(`Server Started! http://localhost:${this.port}, pid: ${process.pid}`)
        resolve(this)
      })
    })
  }

  async close () {
    if (this.server) {
      await this.server.close()
    }

    this.app.servLog.info('Server stopped.')
    return this
  }
}

module.exports = ExpressServer
