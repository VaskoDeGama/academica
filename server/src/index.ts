import { configure, getLogger } from 'log4js'
import { loggerConfig } from './utils/logger'
import config from 'config'
import app from './app'

configure(loggerConfig)
const log = getLogger('Server')
const port = config.get('Server.port')

app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
