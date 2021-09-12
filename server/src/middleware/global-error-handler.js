'use strict'

const BaseController = require('../controllers/base-controller')
const { appLogger: logger } = require('../utils/logger')
const { RequestDTO, ResultDTO } = require('../models')

const globalErrorHandler = function (error, req, res, next) {
  const reqDTO = new RequestDTO(req)
  const resultDTO = new ResultDTO(reqDTO)

  if (error) {
    if (Reflect.has(error, 'code') || Reflect.has(error, 'status')) {
      resultDTO.addError(error)
      BaseController.setResponse({ req, res, resultDTO })
    } else {
      logger.error(error)
      BaseController.setResponse({ req, res, code: 500 })
    }
  }

  next()
}

module.exports = globalErrorHandler
