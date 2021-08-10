import { createExpressServer } from 'routing-controllers'
import { Application } from 'express'
import {
  GlobalErrorHandler,
  SetMetrics,
  FinalMiddleware,
  HttpLogger,
  BodyParser,
  HttpContext,
  UrlEncoder
} from './middleware'
import { UserController } from './controllers'

const app : Application = createExpressServer({
  cors: true,
  controllers: [UserController],
  middlewares: [BodyParser, UrlEncoder, HttpContext, SetMetrics, HttpLogger, FinalMiddleware, GlobalErrorHandler],
  defaultErrorHandler: false
})
app.disable('x-powered-by')

export default app
