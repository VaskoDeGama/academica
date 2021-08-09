import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'

import { configure, getLogger } from 'log4js'
import { loggerConfig } from './utils/logger'
import * as swaggerDocument from '../swagger/openapi.json'
import { createExpressServer } from 'routing-controllers'
import { GlobalErrorHandler, SetMetrics, FinalMiddleware, HttpLogger, BodyParser, HttpContext } from './middleware'
import { UserController } from './controllers'

configure(loggerConfig)
const log = getLogger('Server')

dotenv.config()
const port = process.env.PORT

const app = createExpressServer({
  cors: true,
  controllers: [UserController],
  middlewares: [BodyParser, HttpContext, SetMetrics, HttpLogger, FinalMiddleware, GlobalErrorHandler],
  defaultErrorHandler: false
})
app.disable('x-powered-by')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
