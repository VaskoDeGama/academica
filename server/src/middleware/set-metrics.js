const { getLogger } = require('log4js')
const { v4: uuid } = require('uuid')
const httpContext = require('express-http-context')

const log = getLogger('Request')

const setMetrics = function (req, res, next) {
  const traceId = uuid()
  httpContext.set('reqStartTime', Date.now())
  httpContext.set('traceId', traceId)
  log.info(`#${traceId}: start request...`)
  next()
}

module.exports = setMetrics
