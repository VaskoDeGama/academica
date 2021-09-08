'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const { Methods, Roles, Types } = require('./../models')

class UserController extends BaseController {
  constructor (authorize, checkPermission) {
    super()
    this.path = '/users'
    this.all = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.teacherAndAdmin = authorize([Roles.teacher, Roles.admin])
    this.selfStudent = checkPermission(Roles.student)

    this.routes = [
      {
        path: '',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [this.teacherAndAdmin]
      },
      {
        path: '/:id',
        method: Methods.GET,
        handler: this.get,
        localMiddleware: [this.all, this.selfStudent]
      },
      {
        path: '',
        method: Methods.GET,
        handler: this.get,
        localMiddleware: [this.teacherAndAdmin]
      },
      {
        path: '/:id',
        method: Methods.PUT,
        handler: this.update,
        localMiddleware: [this.all, this.selfStudent]
      },
      {
        path: '/:id',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [this.teacherAndAdmin]
      },
      {
        path: '',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [this.teacherAndAdmin]
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
  async create (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const resultDTO = await userService.createUser(reqDTO)
    this.setResp({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async get (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const resultDTO = await userService.getUser(reqDTO)
    this.setResp({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async update (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const resultDTO = await userService.updateUser(reqDTO)

    this.setResp({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async delete (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const resultDTO = await userService.removeUser(reqDTO)

    this.setResp({ res, req, resultDTO })

    next()
  }
}

module.exports = UserController
