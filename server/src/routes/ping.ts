import express, { Request, Response, NextFunction } from 'express'

import httpContext from 'express-http-context'

const pingRouter = express.Router()

pingRouter.get('', (req: Request, res: Response, next: NextFunction) => {
  const startTime = httpContext.get('reqStartTime')
  res.status(200).json({
    success: true,
    isOnline: true,
    timing: Date.now() - startTime
  })
  next()
})

export default pingRouter
