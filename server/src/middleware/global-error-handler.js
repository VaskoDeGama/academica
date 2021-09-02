'use strict'

const BaseController = require('../controllers/base-controller')
const { TokenExpiredError } = require('jsonwebtoken')
const { ResultDTO, RequestDTO } = require('../models')
const { UnauthorizedError } = require('express-jwt')
const { appLogger: logger } = require('../utils/logger')

const globalErrorHandler = function (error, req, res, next) {
  const reqDTO = new RequestDTO(req)
  const resultDTO = new ResultDTO(reqDTO)

  if (error.inner instanceof TokenExpiredError) {
    resultDTO.addError('Unauthorized! Access Token was expired!', 401)
    BaseController.setResponse({ req, res, resultDTO })
  } else if (error instanceof UnauthorizedError) {
    resultDTO.addError('No token provided!', 403)
    BaseController.setResponse({ req, res, resultDTO })
  } else {
    logger.error(error)
    BaseController.setResponse({ req, res, code: 500 })
  }

  next()
}

module.exports = globalErrorHandler
