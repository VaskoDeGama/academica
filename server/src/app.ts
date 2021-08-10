import express, { Application } from 'express'
import { middleware as httpContext } from 'express-http-context'
import { json, urlencoded } from 'body-parser'
import { connectLogger, getLogger } from 'log4js'
import { httpFormatter } from './utils/logger'
const httpLogger = connectLogger(getLogger('Request'), {
  level: 'INFO',
  format: (req, res, format) => httpFormatter(req, res, format)
})

const app : Application = express()

app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true }))
app.use(httpContext)
app.disable('x-powered-by')
app.use(httpLogger)

export default app
