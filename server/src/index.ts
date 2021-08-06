import httpContext from 'express-http-context'
import swaggerUi from 'swagger-ui-express'
import bodyParser from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { configure, getLogger, connectLogger } from 'log4js'
import { loggerConfig, httpFormatter } from './utils/logger'
import * as swaggerDocument from '../swagger/openapi.json'
import { useExpressServer } from 'routing-controllers'

import { GlobalErrorHandler } from './middleware'
import { UserController } from './controllers'

configure(loggerConfig)
const log = getLogger('Server')

dotenv.config()
const port = process.env.PORT

const app = express()
const httpLogger = connectLogger(getLogger('Request'), {
  level: 'INFO',
  format: (req, res, format) => httpFormatter(req, res, format)
})
app.use(cors())
app.use(bodyParser.json())
app.use(httpContext.middleware)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.disable('x-powered-by')
useExpressServer(app, {
  controllers: [UserController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
})
app.use(httpLogger)

app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
