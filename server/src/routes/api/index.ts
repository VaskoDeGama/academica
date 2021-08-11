import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './users'

const apiRouter = express.Router()

apiRouter.get('', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    endpoint: 'api  root'
  })
  next()
})
apiRouter.use('/users', usersRouter)

export default apiRouter
