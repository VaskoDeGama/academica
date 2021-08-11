import { Request, Response } from 'express'
import { getLogger } from 'log4js'

const log = getLogger('app')

export const finalMiddleware = function (req: Request, res: Response) {
  if (!res.headersSent) {
    log.error('FinalMiddleware reached, ending response.', { id: req.path, type: 'route' })
    res.status(404)
    res.send({
      error: 'NotFoundError',
      message: 'Route not found'
    })
  }
  res.end()
}
