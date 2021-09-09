'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const { Methods, Roles, Types, Actions } = require('./../models')
const { Validators } = require('../models')

class UserController extends BaseController {
  constructor (authorize, checkPermission, validate) {
    super()
    this.path = '/users'

    this.ALL = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.TEACHER_ADMIN = authorize([Roles.teacher, Roles.admin])

    this.USER_CREATE = checkPermission('users', Actions.CREATE)
    this.USER_DELETE = checkPermission('users', Actions.DELETE)
    this.USER_UPDATE = checkPermission('users', Actions.UPDATE)
    this.USER_READ = checkPermission('users', Actions.READ)

    this.ID_VALIDATE = validate(Validators.idSchema)
    this.USER_CREATE_VALIDATE = validate(Validators.userSchema)
    this.USER_UPDATE_VALIDATE = validate(Validators.userUpdateSchema)

    this.routes = [
      {
        path: '',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [this.TEACHER_ADMIN, this.USER_CREATE, this.USER_CREATE_VALIDATE]
      },
      {
        path: '/:id',
        method: Methods.GET,
        handler: this.getById,
        localMiddleware: [this.ALL, this.USER_READ, this.ID_VALIDATE]
      },
      {
        path: '',
        method: Methods.GET,
        handler: this.getAllAndQuery,
        localMiddleware: [this.TEACHER_ADMIN, this.USER_READ, this.ID_VALIDATE]
      },
      {
        path: '/:id',
        method: Methods.PUT,
        handler: this.update,
        localMiddleware: [this.ALL, this.USER_UPDATE, this.ID_VALIDATE, this.USER_UPDATE_VALIDATE]
      },
      {
        path: '/:id',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [this.TEACHER_ADMIN, this.USER_DELETE, this.ID_VALIDATE]
      },
      {
        path: '',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [this.TEACHER_ADMIN, this.USER_DELETE, this.ID_VALIDATE]
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
  async getAllAndQuery (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const userService = reqDTO.ioc.get(Types.userService)
    const resultDTO = await userService.getUsers(reqDTO)
    this.setResp({ res, req, resultDTO })

    next()
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async getById (req, res, next) {
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
