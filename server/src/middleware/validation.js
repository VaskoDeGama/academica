'use strict'

const { checkSchema, validationResult } = require('express-validator')
const { RequestDTO, ResultDTO } = require('../models')
const { BaseController } = require('../controllers')

const validate = function (validationSchema) {
  return [
    checkSchema(validationSchema),
    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const reqDTO = new RequestDTO(req)
        const resultDTO = new ResultDTO(reqDTO)

        Object.values(errors.mapped()).forEach(error => {
          error.status = 400
          error.type = 'ValidationError'
          error.stack = new Error().stack
          resultDTO.addError(error)
        })
        BaseController.setResponse({ req, res, resultDTO })
        return res.end()
      }
      next()
    }
  ]
}

module.exports = validate
