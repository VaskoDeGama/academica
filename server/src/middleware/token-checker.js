'use strict'
const config = require('config')
const jwt = require('jsonwebtoken')
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

      let message = 'Access denied.'
      const error = e.name

      if (e.name === 'TokenExpiredError') {
        message = 'Token expired'
      }

      if (e) {
        res.status(403).json({
          error,
          message
        })
      }
    }
  } else {
    res.status(403).send({
      error: '403 Forbidden',
      message: 'Unauthorized access.'
    })
    res.end()
  }
}

module.exports = tokenChecker
