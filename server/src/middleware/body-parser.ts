import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import { json } from 'body-parser'

const jsonParser = json({ limit: '10mb' })

@Middleware({ type: 'before' })
export class BodyParser implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    jsonParser(req, res, next)
  }
}
