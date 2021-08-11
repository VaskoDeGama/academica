import cors from 'cors'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import { middleware as httpContext } from 'express-http-context'
import { setupLogging } from './logger'

export class ExpressServer {
    app: express.Express

    constructor () {
      this.app = express()

      this.app.use(cors())
      this.app.use(json({ limit: '10mb' }))
      this.app.use(urlencoded({ extended: true }))
      this.app.use(httpContext)
      this.app.disable('x-powered-by')
      setupLogging(this.app)
    }
}
