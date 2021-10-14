'use strict'

const express = require('express')

const apiRouter = express.Router()

const { UserController, AuthController, ScheduleController } = require('../controllers')

const { authorize, checkPermissions, validate } = require('../middleware')

const { path: userPath, router: userRouter } = new UserController(authorize, checkPermissions, validate)
const { path: authPath, router: authRouter } = new AuthController(authorize, validate)
const { path: schedulePath, router: scheduleRouter } = new ScheduleController(authorize, checkPermissions, validate)

apiRouter.use(userPath, userRouter)
apiRouter.use(authPath, authRouter)
apiRouter.use(schedulePath, scheduleRouter)

module.exports = apiRouter
