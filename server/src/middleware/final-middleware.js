'use strict'

const { ioc } = require('./../utils/di-container')
const Types = require('./../utils/ioc-types')
const reqLogger = ioc.get(Types.reqLogger)
const ctx = ioc.get(Types.ctx)

const BaseController = require('../controllers/base-controller')

const finalMiddleware = function (req, res) {
  if (!res.headersSent) {
    const reqId = ctx.get('traceId')
    reqLogger.error(`#${reqId}: FinalMiddleware reached, ending response.`, { id: req.path, type: 'route' })
    BaseController.setResponse({ res, code: 404 })
  }
  res.end()
}

module.exports = finalMiddleware
