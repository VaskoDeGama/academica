const ctx = require('express-http-context')
const { appLogger, requestLogger } = require('../utils/logger')
const Server = require('../configs/server')
const DataBase = require('../configs/database')
const Cache = require('../configs/cache')
const { MongoRepository } = require('../repositories')
const { AuthService, UserService } = require('../services')
const { User, Token, Types } = require('../models')
/**
 * @param {DiContainer} ioc
 */
function init (ioc) {
  ioc.register(Types.container, ioc)
  ioc.register(Types.ctx, ctx)
  ioc.register(Types.logger, appLogger)
  ioc.register(Types.reqLogger, requestLogger)

  ioc.register(Types.user, User)
  ioc.register(Types.token, Token)

  ioc.factory(Types.server, Server, [Types.logger, Types.container])
  ioc.factory(Types.db, DataBase, [Types.logger])
  ioc.factory(Types.cache, Cache, [Types.logger])

  ioc.factory(Types.userRepository, MongoRepository, [Types.user])
  ioc.factory(Types.tokenRepository, MongoRepository, [Types.token])

  ioc.factory(Types.authService, AuthService, [Types.userRepository, Types.tokenRepository, Types.cache])
  ioc.factory(Types.userService, UserService, [Types.userRepository])
}

module.exports = init
