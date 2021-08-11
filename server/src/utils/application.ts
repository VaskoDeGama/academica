import { ExpressServer } from './express-server'
import { logger } from './logger'
import * as http from 'http'
import config from 'config'
import { useExpressServer } from 'routing-controllers'
import { UserController } from '../controllers/user-controller'
import { SetMetrics } from '../middleware/set-metrics'
import { FinalMiddleware } from '../middleware/final-middleware'
import { GlobalErrorHandler } from '../middleware/global-error-handler'

export class Application {
    server: http.Server
    express: ExpressServer

    constructor () {
      this.express = new ExpressServer()

      useExpressServer(this.express.app, {
        cors: true,
        controllers: [UserController],
        middlewares: [SetMetrics, FinalMiddleware, GlobalErrorHandler],
        defaultErrorHandler: false
      })
    }

    start () : Application {
      const port = config.get('Server.port')

      this.server = this.express.app.listen(port, () => {
        logger.info(`
        ------------
        Server Started!
        Http: http://localhost:${port}, pid: ${process.pid}
        ------------
      `)
      })
      return this
    }

    stop () : Application {
      if (this.server) {
        this.server.close()
      }
      return this
    }
}
