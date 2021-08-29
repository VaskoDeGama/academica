'use strict'

const { ioc } = require('./../utils/di-container')
const Types = require('./../utils/ioc-types')
const reqLogger = ioc.get(Types.reqLogger)
const ctx = ioc.get(Types.ctx)

const { v4: uuid } = require('uuid')

const setMetrics = function (req, res, next) {
  const traceId = req.headers.reqid || uuid()
  ctx.set('reqStartTime', Date.now())
  ctx.set('traceId', traceId)
  reqLogger.info(`#${traceId}: start request...`)
  next()
}

module.exports = setMetrics
