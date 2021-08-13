const { v4: uuid } = require('uuid')
const httpContext = require('express-http-context')

const setMetrics = function (req, res, next) {
  const traceId = uuid()
  httpContext.set('reqStartTime', Date.now())
  httpContext.set('traceId', traceId)
  req.app.reqLog.info(`#${traceId}: start request...`)
  next()
}

module.exports = setMetrics
