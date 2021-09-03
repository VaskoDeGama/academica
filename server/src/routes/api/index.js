'use strict'

const express = require('express')

const apiRouter = express.Router()

const { UserController, AuthController } = require('../../controllers')

const { authorize } = require('../../middleware')

const { path: userPath, router: userRouter } = new UserController(authorize)
const { path: authPath, router: authRouter } = new AuthController(authorize)

apiRouter.use(userPath, userRouter)
apiRouter.use(authPath, authRouter)

module.exports = apiRouter
