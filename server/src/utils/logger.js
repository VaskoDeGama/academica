'use strict'

const { configure, connectLogger, getLogger } = require('log4js')
const httpContext = require('express-http-context')
const config = require('config')

configure(config.logger)

const appLogger = getLogger('Server')
const requestLogger = getLogger('Request')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} format
 * @returns {string}
 */
function httpFormatter (req, res, format) {
  const startTime = httpContext.get('reqStartTime')
  const traceId = httpContext.get('traceId')
  return format(`#${traceId}: :method :url | processed for: ${Date.now() - startTime}ms | resStatus: ${res.statusCode}`)
}

const traceLogger = connectLogger(getLogger('Request'), {
  level: 'INFO',
  format: httpFormatter
})

module.exports = {
  appLogger,
  requestLogger,
  traceLogger,
  httpFormatter
}
