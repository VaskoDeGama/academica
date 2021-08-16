'use strict'

const usersRouter = require('./users.js')
const authRouter = require('./auth.js')
const express = require('express')

const apiRouter = express.Router()

apiRouter.use('/users', usersRouter)
apiRouter.use('/auth', authRouter)

module.exports = apiRouter
