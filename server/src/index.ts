import { configure, getLogger } from 'log4js'
import { loggerConfig } from './utils/logger'
import config from 'config'
import app from './app'
import { useExpressServer } from 'routing-controllers'
import { SetMetrics } from './middleware/set-metrics'
import { FinalMiddleware } from './middleware/final-middleware'
import { GlobalErrorHandler } from './middleware/global-error-handler'
import { UserController } from './controllers/user-controller'

configure(loggerConfig)
const log = getLogger('Server')
const port = config.get('Server.port')

useExpressServer(app, {
  cors: true,
  controllers: [UserController],
  middlewares: [SetMetrics, FinalMiddleware, GlobalErrorHandler],
  defaultErrorHandler: false
})

app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
