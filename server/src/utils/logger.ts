import * as httpContext from 'express-http-context'
import { Request, Response } from 'express'
const loggerConfig = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: './log/access.log',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      category: 'http'
    },
    app: {
      type: 'dateFile',
      filename: './log/app.log',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      filename: './log/errors.log'
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile'
    },
    console: {
      type: 'console',
      level: 'DEBUG'
    }
  },
  categories: {
    default: { appenders: ['app', 'errors', 'console'], level: 'DEBUG' },
    Request: { appenders: ['console', 'access'], level: 'DEBUG' }
  }
}

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

export {
  loggerConfig,
  httpFormatter
}
