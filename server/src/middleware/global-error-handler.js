'use strict'

const BaseController = require('../controllers/base-controller')
const globalErrorHandler = function (error, req, res, next) {
  if (error.status) {
    BaseController.setResponse({ req, res, code: error.status })
  } else {
    req.app.servLog.error(error)
    BaseController.setResponse({ req, res, code: 500 })
  }
  next()
}

module.exports = globalErrorHandler
