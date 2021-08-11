import express, { Request, Response, NextFunction } from 'express'

const usersRouter = express.Router()

usersRouter
  .get('', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'getAllPoint or FindPoint'
    })
    next()
  })
  .get('/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'getOnePoint'
    })
    next()
  })
  .delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'delete point'
    })
    next()
  })
  .post('', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'createPoint'
    })
    next()
  })
  .patch('/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'update part Point'
    })
    next()
  })
  .put('/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      endpoint: 'update all point'
    })
    next()
  })

export default usersRouter
