'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const validator = require('../utils/validator')
const { userScheme } = require('../models/user')
const ResultDTO = require('../models/result-dto')

class UserController extends BaseController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async create (req, res, next) {
    const reqDTO = new RequestDTO(req)
    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.service.createUser(reqDTO)
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
    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.service.getUser(reqDTO)
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
    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.service.updateUser(reqDTO)

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
    const { hasErrors, errors } = validator(reqDTO, userScheme)
    const resultDTO = hasErrors ? new ResultDTO(reqDTO, errors) : await this.service.removeUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = UserController
