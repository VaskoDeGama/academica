'use strict'
const config = require('config')
const Types = require('./../utils/ioc-types')
const { ioc } = require('../utils/di-container')
const ctx = require('express-http-context')
const { appLogger, requestLogger } = require('../utils/logger')
const Server = require('./server')
const DataBase = require('./database')
const Cache = require('./cache')

class App {
  constructor () {
    this.initIOC()

    this.db = ioc.get(Types.db)
    this.server = ioc.get(Types.server)
    this.cache = ioc.get(Types.cache)
  }

  async start () {
    try {
      await this.db.connect()
      await this.cache.connect()
      await this.server.start()
    } catch (error) {
      await this.stop()
    }
  }

  async stop () {
    await this.db.close()
    await this.cache.close()
    await this.server.stop()
  }

  initIOC () {
    ioc.register(Types.serverConfig, config.server)
    ioc.register(Types.dbConfig, config.db)
    ioc.register(Types.cacheConfig, config.cache)
    ioc.register(Types.ctx, ctx)
    ioc.register(Types.logger, appLogger)
    ioc.register(Types.reqLogger, requestLogger)

    ioc.factory(Types.server, Server, [Types.serverConfig, Types.logger])
    ioc.factory(Types.db, DataBase, [Types.dbConfig, Types.logger])
    ioc.factory(Types.cache, Cache, [Types.cacheConfig, Types.logger])
  }
}

module.exports = App
