'use strict'

const BaseController = require('../controllers/base-controller')
const globalErrorHandler = function (error, req, res, next) {
  req.app.servLog.error(error)
  BaseController.setResponse({ req, res, code: 500 })
  next()
}

module.exports = globalErrorHandler
