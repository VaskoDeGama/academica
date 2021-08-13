
const globalErrorHandler = function (error, req, res, next) {
  req.app.servLog.error(error)
  const status = error.httpCode || error.status || 500
  res.status(status).json({ success: false, status, error: error.message })
  next()
}

module.exports = globalErrorHandler
