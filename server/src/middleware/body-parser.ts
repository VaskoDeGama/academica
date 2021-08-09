import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

const parser = bodyParser.json({ limit: '10mb' })

@Middleware({ type: 'before' })
export class BodyParser implements ExpressMiddlewareInterface {
  use (req: Request, res: Response, next: NextFunction): void {
    parser(req, res, next)
  }
}
