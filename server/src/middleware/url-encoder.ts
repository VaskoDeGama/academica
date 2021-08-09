import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import { urlencoded } from 'body-parser'

const urlEncoder = urlencoded({ extended: true })

@Middleware({ type: 'before' })
export class UrlEncoder implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    urlEncoder(req, res, next)
  }
}
