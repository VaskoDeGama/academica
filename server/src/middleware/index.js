'use strict'

const setMetrics = require('./set-metrics')
const globalErrorHandler = require('./global-error-handler')
const finalMiddleware = require('./final-middleware')
const tokenChecker = require('./token-checker')

module.exports = {
  setMetrics,
  globalErrorHandler,
  finalMiddleware,
  tokenChecker
}
