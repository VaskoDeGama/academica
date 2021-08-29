'use strict'

const { configure, connectLogger, getLogger } = require('log4js')
const httpContext = require('express-http-context')
const config = require('config')

configure(config.logger)

const appLogger = getLogger('Server')
const requestLogger = getLogger('Request')
const traceLogger = connectLogger(getLogger('Request'), {
  level: 'INFO',
  format: (req, res, format) => httpFormatter(req, res, format)
})

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
  return format(`#${traceId}: :method :url | processed for: ${Date.now() - startTime}ms | ${JSON.stringify(req.body)}`)
}

module.exports = {
  appLogger,
  requestLogger,
  traceLogger
}
