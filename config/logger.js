const appenders =  {
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
}




module.exports = {
  production: {
    appenders,
    categories: {
      default: { appenders: ['app', 'errors', 'console'], level: 'INFO' },
      Request: { appenders: ['access'], level: 'INFO' }
    }
  },
  test: {
    appenders,
    categories: {
      default: { appenders: ['console'], level: 'ERROR' },
      Request: { appenders: ['console'], level: 'ERROR' }
    }
  },
  default: {
    appenders,
    categories: {
      default: { appenders: ['console'], level: 'ALL' },
      Request: { appenders: ['console'], level: 'ALL' }
    }
  }
}
