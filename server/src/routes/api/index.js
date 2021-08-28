'use strict'

const usersRouter = require('./users.js')
const authRouter = require('./auth.js')
const express = require('express')

const apiRouter = express.Router()

const { authorize } = require('../../middleware')
const { Roles } = require('../../models')
const authMW = authorize([Roles.admin, Roles.teacher])

apiRouter.use('/users', authMW, usersRouter)
apiRouter.use('/', authRouter)

module.exports = apiRouter
