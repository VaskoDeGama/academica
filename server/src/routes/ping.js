const httpContext = require('express-http-context')
const mongoose = require('mongoose')
const express = require('express')

const pingRouter = express.Router()

pingRouter.get('', (req, res, next) => {
  const startTime = httpContext.get('reqStartTime')
  res.status(200).json({
    success: true,
    isOnline: true,
    timing: Date.now() - startTime,
    dbState: mongoose.STATES[mongoose.connection.readyState]
  })
  next()
})

module.exports = pingRouter
