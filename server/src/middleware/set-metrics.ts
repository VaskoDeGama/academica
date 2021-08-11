import { NextFunction, Request, Response } from 'express'
import httpContext from 'express-http-context'
import { v4 as uuid } from 'uuid'
import { getLogger } from 'log4js'

import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'

const log = getLogger('Request')

@Middleware({ type: 'before' })
export class SetMetrics implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next?: NextFunction): void {
    const traceId = uuid()
    httpContext.set('reqStartTime', Date.now())
    httpContext.set('traceId', traceId)
    log.info(`#${traceId}: start request...`)
    next()
  }
}
