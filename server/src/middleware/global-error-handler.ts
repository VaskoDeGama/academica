import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers'
import { NextFunction, Request, Response } from 'express'
import { getLogger } from 'log4js'

const log = getLogger('app')

interface HttpErrorWithStatus extends HttpError {
  status: number
}

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: HttpErrorWithStatus, request: Request, response: Response, next: () => NextFunction) {
    log.error(error)
    response.status(error.httpCode || error.status).json(error)
    next()
  }
}
