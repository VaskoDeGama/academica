module.exports = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: './log/access.log',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      category: 'http'
    },
    app: {
      type: 'dateFile',
      filename: './log/app.log',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      keepFileExt: true,
      filename: './log/errors.log'
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
