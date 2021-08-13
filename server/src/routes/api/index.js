const usersRouter = require('./users.js')
const express = require('express')

const apiRouter = express.Router()

apiRouter.use('/users', usersRouter)

module.exports = apiRouter
