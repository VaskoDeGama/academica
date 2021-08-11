import { NextFunction, Request, Response } from 'express'
import { getLogger } from 'log4js'

const log = getLogger('app')

interface HttpErrorWithStatus extends Error {
  status: number,
  httpCode: number
}

export const globalErrorHandler = function (error: HttpErrorWithStatus, req: Request, res: Response, next: NextFunction) {
  log.error(error)
  const status = error.httpCode || error.status || 500
  res.status(status).json({ success: false, status, error: error.message })
  next()
}
