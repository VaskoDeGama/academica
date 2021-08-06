import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers'
import { getLogger } from 'log4js'
const log = getLogger('app')

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: any, request: any, response: any, next: () => any) {
    log.error(error)
    response.status(error.statusCode || error.httpCode).json(error)
    next()
  }
}
