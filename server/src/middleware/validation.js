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

        Object.entries(errors.mapped()).forEach(([field, { msg }]) => {
          resultDTO.addError(`${msg}`, 400, 'ValidationError')
        })
        BaseController.setResponse({ req, res, resultDTO })
        return res.end()
      }
      next()
    }
  ]
}

module.exports = validate
