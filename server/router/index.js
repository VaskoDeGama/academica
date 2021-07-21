'use strict'

const responseMessage = require('./../utils/response-message')

const router = (req, res, next) => {
  try {
    res.statusCode = 200
    res.setHeader('Conent-Type', 'application/json')
    res.end(JSON.stringify(responseMessage({
      success: true,
      data: {
        message: 'Hello world!'
      }
    })))
  } catch (err) {
    next(err)
  }
}

module.exports = router
