const httpContext = require('express-http-context')

const finalMiddleware = function (req, res) {
  if (!res.headersSent) {
    const reqId = httpContext.get('traceId')
    req.app.reqLog.error(`#${reqId}: FinalMiddleware reached, ending response.`, { id: req.path, type: 'route' })
    res.status(404)
    res.send({
      error: 'NotFoundError',
      message: 'Route not found'
    })
  }
  res.end()
}

module.exports = finalMiddleware
