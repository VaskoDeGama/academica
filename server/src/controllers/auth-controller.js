'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const { Roles, Types, Methods, Validators } = require('./../models')

class AuthController extends BaseController {
  constructor (authorize, validate) {
    super()
    this.path = ''
    this.ALL = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.LOGIN_VALIDATE = validate(Validators.loginSchema)

    this.routes = [
      {
        path: '/login',
        method: Methods.POST,
        handler: this.authenticate,
        localMiddleware: [this.LOGIN_VALIDATE]
      },
      {
        path: '/refresh',
        method: Methods.GET,
        handler: this.refreshToken,
        localMiddleware: []
      },
      {
        path: '/tokens',
        method: Methods.GET,
        handler: this.getTokens,
        localMiddleware: [this.ALL]
      },
      {
        path: '/logout',
        method: Methods.GET,
        handler: this.revokeToken,
        localMiddleware: [this.ALL]
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
    const resultDTO = await authService.authenticate(reqDTO)
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
