import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import { middleware as httpContext } from 'express-http-context'

@Middleware({ type: 'before' })
export class HttpContext implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    httpContext(req, res, next)
  }
}
