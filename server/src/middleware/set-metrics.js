'use strict'

const { ioc } = require('./../utils/di-container')
const Types = require('./../utils/ioc-types')
const { v4: uuid } = require('uuid')

const setMetrics = function (req, res, next) {
  const ctx = ioc.get(Types.ctx)
  const reqLogger = ioc.get(Types.reqLogger)
  const traceId = req.headers.reqid || uuid()
  ctx.set('reqStartTime', Date.now())
  ctx.set('traceId', traceId)
  reqLogger.info(`#${traceId}: start request...`)
  next()
}

module.exports = setMetrics
