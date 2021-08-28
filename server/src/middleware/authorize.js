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
      if ((roles.length && !roles.includes(req.user.role))) {
        // user no longer exists or role not authorized
        BaseController.setResponse({ req, res, code: 401 })
        res.end()
      }

      const refreshTokens = await tokeRepository.findByQuery({ user: req.user.id })
      req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token)
      next()
    }
  ]
}

module.exports = authorize
