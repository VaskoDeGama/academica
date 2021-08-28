'use strict'
const config = require('config')
const jwt = require('express-jwt')

const { User, Token } = require('../models')
const { MongoRepository } = require('../repositories')
const { BaseController } = require('../controllers')
const { secret } = config.server

const userRepository = new MongoRepository(User)
const tokeRepository = new MongoRepository(Token)

const authorize = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    jwt({ secret, algorithms: ['HS256'] }),
    async (req, res, next) => {
      const user = await userRepository.findById(req.user.id)

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        BaseController.setResponse({ req, res, code: 401 })
        res.end()
      }

      req.user.role = user.role
      const refreshTokens = await tokeRepository.findByQuery({ user: user.id })
      req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token)
      next()
    }
  ]
}

module.exports = authorize
