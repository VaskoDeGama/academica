import cors from 'cors'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import { middleware as httpContext } from 'express-http-context'
import { logger, setupLogging } from './logger'
import config from 'config'
import * as http from 'http'
import { setMetrics, globalErrorHandler, finalMiddleware } from '../middleware'
import { pingRouter, apiRouter } from '../routes'

export class ExpressServer {
    app: express.Express
    server: http.Server

    constructor () {
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

    start () : ExpressServer {
      const port = config.get('Server.port')

      this.server = this.app.listen(port, async () => {
        logger.info(`Server Started! http://localhost:${port}, pid: ${process.pid}`)
      })
      return this
    }

    stop () : ExpressServer {
      if (this.server) {
        this.server.close()
      }
      return this
    }
}
