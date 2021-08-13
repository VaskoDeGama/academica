const setMetrics = require('./set-metrics')
const globalErrorHandler = require('./global-error-handler')
const finalMiddleware = require('./final-middleware')

module.exports = {
  setMetrics,
  globalErrorHandler,
  finalMiddleware
}
