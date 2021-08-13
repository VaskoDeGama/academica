const { getLogger } = require('log4js')
const log = getLogger('app')

const globalErrorHandler = function (error, req, res, next) {
  log.error(error)
  const status = error.httpCode || error.status || 500
  res.status(status).json({ success: false, status, error: error.message })
  next()
}

module.exports = globalErrorHandler
