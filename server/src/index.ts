import swaggerUi from 'swagger-ui-express'
import config from 'config'

import { configure, getLogger } from 'log4js'
import { loggerConfig } from './utils/logger'
import * as swaggerDocument from '../swagger/openapi.json'
import { createExpressServer } from 'routing-controllers'
import {
  GlobalErrorHandler,
  SetMetrics,
  FinalMiddleware,
  HttpLogger,
  BodyParser,
  HttpContext,
  UrlEncoder
} from './middleware'
import { UserController } from './controllers'

configure(loggerConfig)
const log = getLogger('Server')

const port = config.get('Server.port')
console.log(config)

const app = createExpressServer({
  cors: true,
  controllers: [UserController],
  middlewares: [BodyParser, UrlEncoder, HttpContext, SetMetrics, HttpLogger, FinalMiddleware, GlobalErrorHandler],
  defaultErrorHandler: false
})
app.disable('x-powered-by')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
