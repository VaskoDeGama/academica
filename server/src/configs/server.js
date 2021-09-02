'use strict'

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const { json, urlencoded } = require('body-parser')
const { middleware: httpContext } = require('express-http-context')
const { setMetrics, globalErrorHandler, finalMiddleware } = require('../middleware')
const { traceLogger } = require('../utils/logger')
const { pingRouter, apiRouter } = require('../routes')

class Server {
  /**
   *
   * @param {Logger} logger
   * @param {DiContainer} ioc
   */
  constructor (logger, ioc) {
    this.server = null
    this.log = logger
    this.app = express()

    this.app.disable('x-powered-by')
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(cookieParser())
    this.app.use(json({ limit: '10mb' }))
    this.app.use(urlencoded({ extended: true }))
    this.app.use(traceLogger)
    this.app.use(httpContext)
    this.app.use(setMetrics)
    this.app.set('ioc', ioc)

    this.app.use(pingRouter)
    this.app.use('/api', apiRouter)

    this.app.use(finalMiddleware)
    this.app.use(globalErrorHandler)
  }

  /**
    @param {object} config
   * @returns {Promise<void>}
   */
  async start (config) {
    await new Promise((resolve) => {
      this.server = this.app.listen(config.port, async () => {
        this.log.info(`Server Started! http://localhost:${config.port}, pid: ${process.pid}`)
        resolve()
      })
    })
  }

  async stop () {
    if (this.server) {
      return new Promise(resolve => {
        this.server.close(() => {
          this.log.info('Server stopped.')
          this.server = null
          resolve()
        })
      })
    }
  }
}

module.exports = Server
