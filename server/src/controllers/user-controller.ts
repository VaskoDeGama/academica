import { UserService } from '../services/user-service'
import { Request, Response, NextFunction } from 'express'

class UserController {
  private userService: UserService = new UserService()

  getOne (req:Request, res: Response, next: NextFunction) {
    console.log(req.params)
    res.status(200).json({
      userId: req.params
    })

    next()
  }
}

export default new UserController()
