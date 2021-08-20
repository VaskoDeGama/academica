'use strict'

const httpContext = require('express-http-context')
const BaseController = require('../controllers/base-controller')

const finalMiddleware = function (req, res) {
  if (!res.headersSent) {
    const reqId = httpContext.get('traceId')
    req.app.reqLog.error(`#${reqId}: FinalMiddleware reached, ending response.`, { id: req.path, type: 'route' })
    BaseController.setResponse({ res, code: 404 })
  }
  res.end()
}

module.exports = finalMiddleware
