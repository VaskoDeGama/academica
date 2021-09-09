'use strict'

const BaseController = require('../controllers/base-controller')
const { requestLogger: logger } = require('../utils/logger')
const ctx = require('express-http-context')

const finalMiddleware = function (req, res) {
  if (!res.headersSent) {
    const reqId = ctx.get('traceId')
    logger.error(`#${reqId}: FinalMiddleware reached, ending response.`, { id: req.path, type: 'route' })
    BaseController.setResponse({ res, code: 404, message: 'Route not found' })
  }
  res.end()
}

module.exports = finalMiddleware
