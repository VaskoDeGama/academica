'use strict'
const config = require('config')
const jwt = require('express-jwt')

const { Token } = require('../models')
const { MongoRepository } = require('../repositories')
const { BaseController } = require('../controllers')
const Types = require('../ioc/types')
const { UnauthorizedError } = require('express-jwt')
const { secret } = config.server

const tokeRepository = new MongoRepository(Token)

const isRevokedCallback = async function (req, payload, done) {
  try {
    const userId = payload.id
    const tokenId = payload.jti
    const cache = req.app.get('ioc').get(Types.cache)
    const token = await cache.get(`${userId}:${tokenId}`)

    if (token) {
      done(new UnauthorizedError(401, new Error('Access Token was expired!')))
    }
    done(null, false)
  } catch (e) {
    done(e)
  }
}

const authorize = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    jwt({ secret, algorithms: ['HS256'], isRevoked: isRevokedCallback }),
    async (req, res, next) => {
      if ((roles.length && !roles.includes(req.user.role))) {
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
