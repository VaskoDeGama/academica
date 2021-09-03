'use strict'

const setMetrics = require('./set-metrics')
const globalErrorHandler = require('./global-error-handler')
const finalMiddleware = require('./final-middleware')
const authorize = require('./authorize')
const checkPermissions = require('./check-permissions')

module.exports = {
  setMetrics,
  globalErrorHandler,
  finalMiddleware,
  authorize,
  checkPermissions
}
