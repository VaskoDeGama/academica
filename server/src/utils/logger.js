const { configure, connectLogger, getLogger } = require('log4js')
const config = require('config')
const httpContext = require('express-http-context')

const loggerConfig = config.get('Logger')
configure(loggerConfig)
const logger = getLogger('Server')

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} format
 * @return {string}
 */
function httpFormatter (req, res, format) {
  const startTime = httpContext.get('reqStartTime')
  const traceId = httpContext.get('traceId')
  return format(`#${traceId}: :method :url | processed for: ${Date.now() - startTime}ms | ${JSON.stringify(req.body)}`)
}

/**
 * @param {Express} app
 */
function setupExpress (app) {
  const httpLogger = connectLogger(getLogger('Request'), {
    level: 'INFO',
    format: (req, res, format) => httpFormatter(req, res, format)
  })
  app.use(httpLogger)
}

/**
 * @param {Express} app
 */
function setupLogging (app) {
  setupExpress(app)
}

module.exports = {
  logger,
  setupLogging
}
