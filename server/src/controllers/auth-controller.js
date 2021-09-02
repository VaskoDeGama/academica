'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const ResultDTO = require('../models/result-dto')
const Types = require('../ioc/types')
const { loginScheme } = require('../models')

class AuthController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async authenticate (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const { hasErrors, errors } = validator(reqDTO, loginScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await authService.authenticate(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async refreshToken (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.refreshToken(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async revokeToken (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.revokeToken(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  static async getTokens (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.getAllTokens(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = AuthController
