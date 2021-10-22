const ctx = require('express-http-context')
const { appLogger, requestLogger } = require('../utils/logger')
const Server = require('../infrastructure/server')
const DataBase = require('../infrastructure/database')
const Cache = require('../infrastructure/cache')
const { MongoRepository } = require('../repositories')
const { AuthService, UserService, ScheduleService } = require('../services')
const { User, Token, Types, Role, Schedule } = require('../models')
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
  ioc.register(Types.role, Role)
  ioc.register(Types.schedule, Schedule)

  ioc.factory(Types.server, Server, [Types.logger, Types.container])
  ioc.factory(Types.db, DataBase, [Types.logger])
  ioc.factory(Types.cache, Cache, [Types.logger])

  ioc.factory(Types.userRepository, MongoRepository, [Types.user])
  ioc.factory(Types.tokenRepository, MongoRepository, [Types.token])
  ioc.factory(Types.roleRepository, MongoRepository, [Types.role])
  ioc.factory(Types.scheduleRepository, MongoRepository, [Types.schedule])
  ioc.factory(Types.windowRepository, MongoRepository, [Types.window])
  ioc.factory(Types.lessonRepository, MongoRepository, [Types.lesson])
  ioc.factory(Types.commentRepository, MongoRepository, [Types.comment])

  ioc.factory(Types.authService, AuthService, [Types.userRepository, Types.tokenRepository, Types.cache])
  ioc.factory(Types.userService, UserService, [Types.userRepository])
  ioc.factory(Types.scheduleService, ScheduleService, [Types.userRepository, Types.scheduleRepository])
}

module.exports = init
