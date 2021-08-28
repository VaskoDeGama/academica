'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const ResultDTO = require('../models/result-dto')
const { loginScheme } = require('../models')

class AuthController {
  /**
   *
   * @param {AuthService} authService
   */
  constructor (authService) {
    this.authService = authService
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async authenticate (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const { hasErrors, errors } = validator(reqDTO, loginScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.authService.authenticate(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async refreshToken (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const resultDTO = await this.authService.refreshToken(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async revokeToken (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const resultDTO = await this.authService.revokeToken(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = AuthController
