const httpContext = require('express-http-context')
const { getLogger } = require('log4js')
const log = getLogger('Request')

const finalMiddleware = function (req, res) {
  if (!res.headersSent) {
    const reqId = httpContext.get('traceId')
    log.error(`#${reqId}: FinalMiddleware reached, ending response.`, { id: req.path, type: 'route' })
    res.status(404)
    res.send({
      error: 'NotFoundError',
      message: 'Route not found'
    })
  }
  res.end()
}

module.exports = finalMiddleware
