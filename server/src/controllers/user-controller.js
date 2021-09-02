'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const ResultDTO = require('../models/result-dto')
const Types = require('../ioc/types')

class UserController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async create (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const userScheme = reqDTO.ioc.get(Types.userScheme)

    const { hasErrors, errors } = validator(reqDTO, userScheme)

    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await userService.createUser(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async get (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const userScheme = reqDTO.ioc.get(Types.userScheme)

    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await userService.getUser(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async update (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const userScheme = reqDTO.ioc.get(Types.userScheme)

    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await userService.updateUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async delete (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const userScheme = reqDTO.ioc.get(Types.userScheme)

    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await userService.removeUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = UserController
