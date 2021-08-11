import * as httpContext from 'express-http-context'
import express, { Request, Response } from 'express'
import { configure, connectLogger, getLogger } from 'log4js'
import config from 'config'

const loggerConfig : string = config.get('Logger')

configure(loggerConfig)
export const logger = getLogger('Server')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} format
 * @return {string}
 */
function httpFormatter (req: Request, res: Response, format: (msg: string) => string) : string {
  const startTime = httpContext.get('reqStartTime')
  const traceId = httpContext.get('traceId')
  return format(`#${traceId}: :method :url | processed for: ${Date.now() - startTime}ms | ${JSON.stringify(req.body)}`)
}

export function setupLogging (app : express.Express) {
  setupExpress(app)
}

function setupExpress (app: express.Express) {
  const httpLogger = connectLogger(getLogger('Request'), {
    level: 'INFO',
    format: (req, res, format) => httpFormatter(req, res, format)
  })
  app.use(httpLogger)
}
