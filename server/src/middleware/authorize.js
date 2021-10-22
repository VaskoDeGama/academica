'use strict'
const config = require('config')
const jwt = require('express-jwt')

const { UnauthorizedError } = require('express-jwt')
const { BaseController } = require('../controllers')
const { secret } = config.server
const { PERMISSIONS } = require('../models')
const Types = require('../models/types')

const isRevokedCallback = async function (req, payload, done) {
  try {
    const userId = payload.id
    const tokenId = payload.jti
    const cache = req.app.get('ioc').get(Types.cache)
    const token = await cache.get(`${userId}:${tokenId}`)

    if (token) {
      done(new UnauthorizedError(401, new Error('Token blacklisted!')))
    }
    done(null, false)
  } catch (e) {
    done(e)
  }
}

/**
 *
 * @param {string[]} roles
 * @returns {Function}
 */
const authorize = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    jwt({ secret, algorithms: ['HS256'], isRevoked: isRevokedCallback }),
    async (req, res, next) => {
      if ((roles.length && !roles.includes(req.user.role))) {
        BaseController.setResponse({ req, res, code: 403 })
        return res.end()
      }

      req.user.permissions = PERMISSIONS[req.user.role]
      next()
    }
  ]
}

module.exports = authorize
