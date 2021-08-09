import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers'
import { NextFunction, Request, Response } from 'express'
import { getLogger } from 'log4js'

const log = getLogger('app')

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: HttpError, request: Request, response: Response, next: () => NextFunction) {
    log.error(error)
    response.status(error.httpCode).json(error)
    next()
  }
}
