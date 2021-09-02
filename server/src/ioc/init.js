const Types = require('./types')
const ctx = require('express-http-context')
const { appLogger, requestLogger } = require('../utils/logger')
const Server = require('../configs/server')
const DataBase = require('../configs/database')
const Cache = require('../configs/cache')
/**
 * @param {DiContainer} ioc
 */
function init (ioc) {
  ioc.register(Types.container, ioc)
  ioc.register(Types.ctx, ctx)
  ioc.register(Types.logger, appLogger)
  ioc.register(Types.reqLogger, requestLogger)

  ioc.factory(Types.server, Server, [Types.logger, Types.container])
  ioc.factory(Types.db, DataBase, [Types.logger])
  ioc.factory(Types.cache, Cache, [Types.logger])
}

module.exports = init
