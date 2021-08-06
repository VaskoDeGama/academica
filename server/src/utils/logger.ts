import httpContext from 'express-http-context'

const loggerConfig = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: './server/log/access.log',
      pattern: '-yyyy-MM-dd',
      category: 'http'
    },
    app: {
      type: 'dateFile',
      filename: './server/log/app.log',
      pattern: '-yyyy-MM-dd',
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      filename: './server/log/errors.log'
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile'
    },
    console: {
      type: 'console',
      level: 'DEBUG'
    }
  },
  categories: {
    default: { appenders: ['app', 'errors', 'console'], level: 'DEBUG' },
    Request: { appenders: ['console', 'access'], level: 'DEBUG' }
  }
}

function httpFormatter (req, res, format) {
  const startTime = httpContext.get('reqStartTime')
  const traceId = httpContext.get('traceId')
  return format(`#${traceId}: :method :url | processed for: ${Date.now() - startTime}ms | ${JSON.stringify(req.body)}`)
}

export {
  loggerConfig,
  httpFormatter
}
