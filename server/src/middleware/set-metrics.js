'use strict'

const { requestLogger: logger } = require('../utils/logger')
const ctx = require('express-http-context')
const { v4: uuid } = require('uuid')
const isEmpty = require('../utils/is-empty')

const setMetrics = function (req, res, next) {
  const traceId = req.headers.reqid || uuid()
  ctx.set('reqStartTime', Date.now())
  ctx.set('traceId', traceId)
  logger.info(`#${traceId}: ${req.method} ${req.url} ${isEmpty(req.body) ? ' ' : `| body: ${JSON.stringify(req.body)}`} `)
  next()
}

module.exports = setMetrics
