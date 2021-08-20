'use strict'
const config = require('config')
const jwt = require('jsonwebtoken')
const BaseController = require('../controllers/base-controller')
const { secret } = config.get('Server')

const tokenChecker = function (req, res, next) {
  const rawToken = req.body.token || req.query.token || req.headers.authorization || ''

  const token = rawToken.replace('Bearer ', '')

  if (token) {
    try {
      const decoded = jwt.verify(token, secret)

      console.log(decoded)
      next()
    } catch (e) {
      console.log('Error', e.name, e.message)

      if (e) {
        BaseController.setResponse({ req, res, code: 401 })
        res.end()
      }
    }
  } else {
    BaseController.setResponse({ req, res, code: 403 })
    res.end()
  }
}

module.exports = tokenChecker
