'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const ResultDTO = require('../models/result-dto')
const Types = require('../ioc/types')
const { loginScheme } = require('../models')
const methods = require('../models/methods')
const { Roles } = require('./../models')

class AuthController extends BaseController {
  constructor (authorize) {
    super()
    this.path = ''
    this.applyAll = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.routes = [
      {
        path: '/login',
        method: methods.POST,
        handler: this.authenticate,
        localMiddleware: []
      },
      {
        path: '/refresh',
        method: methods.GET,
        handler: this.refreshToken,
        localMiddleware: [this.applyAll]
      },
      {
        path: '/tokens',
        method: methods.GET,
        handler: this.getTokens,
        localMiddleware: [this.applyAll]
      },
      {
        path: '/logout',
        method: methods.PUT,
        handler: this.revokeToken,
        localMiddleware: []
      }
    ]

    this.setRoutes()

    return {
      path: this.path,
      router: this.router
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async authenticate (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const { hasErrors, errors } = validator(reqDTO, loginScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await authService.authenticate(reqDTO)
    this.setResp({ res, req, resultDTO })

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
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.refreshToken(reqDTO)
    this.setResp({ res, req, resultDTO })

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
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.revokeToken(reqDTO)
    this.setResp({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async getTokens (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const authService = reqDTO.ioc.get(Types.authService)
    const resultDTO = await authService.getAllTokens(reqDTO)
    this.setResp({ res, req, resultDTO })

    next()
  }
}

module.exports = AuthController
