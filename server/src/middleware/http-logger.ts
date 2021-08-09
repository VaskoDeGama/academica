import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import { getLogger, connectLogger } from 'log4js'

import { httpFormatter } from '../utils/logger'
const httpLogger = connectLogger(getLogger('Request'), {
  level: 'INFO',
  format: (req, res, format) => httpFormatter(req, res, format)
})

@Middleware({ type: 'after' })
export class HttpLogger implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    httpLogger(req, res, next)
  }
}
