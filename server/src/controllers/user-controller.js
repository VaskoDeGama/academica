'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const ResultDTO = require('../models/result-dto')

class UserController {
  /**
   *
   * @param {UserService} userService
   * @param {scheme} userScheme
   */
  constructor (userService, userScheme) {
    this.userService = userService
    this.userScheme = userScheme
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async create (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const { hasErrors, errors } = validator(reqDTO, this.userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.userService.createUser(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

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
    const { hasErrors, errors } = validator(reqDTO, this.userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.userService.getUser(reqDTO)
    BaseController.setResponse({ res, req, resultDTO })

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
    const { hasErrors, errors } = validator(reqDTO, this.userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.userService.updateUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

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
    const { hasErrors, errors } = validator(reqDTO, this.userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.userService.removeUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = UserController
