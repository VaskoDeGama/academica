import { Middleware, ExpressMiddlewareInterface, NotFoundError } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import { getLogger } from 'log4js'

const log = getLogger('app')

@Middleware({ type: 'after' })
export class FinalMiddleware implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    if (!res.headersSent) {
      res.status(404)
      res.send(new NotFoundError('Route not found'))
    }
    log.error('FinalMiddleware reached, ending response.', { id: req.path, type: 'route' })
    res.end()
  }
}
