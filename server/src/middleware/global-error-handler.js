'use strict'

const BaseController = require('../controllers/base-controller')
const { appLogger: logger } = require('../utils/logger')
const { RequestDTO, ResultDTO } = require('../models')

const msgMap = {
  'jwt expired': 'Token expired!'
}

const globalErrorHandler = function (error, req, res, next) {
  const reqDTO = new RequestDTO(req)
  const resultDTO = new ResultDTO(reqDTO)

  if (Reflect.has(error, 'code') || Reflect.has(error, 'status')) {
    const code = typeof error.code === 'number' ? error.code : error.status
    const message = msgMap[error.message] || error.message

    resultDTO.addError(message)
    resultDTO.status = code
    BaseController.setResponse({ req, res, resultDTO })
  } else {
    logger.error(error)
    BaseController.setResponse({ req, res, code: 500 })
  }

  next()
}

module.exports = globalErrorHandler
