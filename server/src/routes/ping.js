const httpContext = require('express-http-context')
const express = require('express')

const pingRouter = express.Router()

pingRouter.get('', (req, res, next) => {
  const startTime = httpContext.get('reqStartTime')
  res.status(200).json({
    success: true,
    isOnline: true,
    timing: Date.now() - startTime
  })
  next()
})

module.exports = pingRouter
