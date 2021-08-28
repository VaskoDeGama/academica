'use strict'

const setMetrics = require('./set-metrics')
const globalErrorHandler = require('./global-error-handler')
const finalMiddleware = require('./final-middleware')
const authorize = require('./authorize')

module.exports = {
  setMetrics,
  globalErrorHandler,
  finalMiddleware,
  authorize
}
