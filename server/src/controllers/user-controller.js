'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')

class UserController extends BaseController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Promise<Response>}
   */
  async create (req, res, next) {
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.createUser(reqDTO)

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
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.getUser(reqDTO)

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
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.updateUser(reqDTO)

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
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.removeUser(reqDTO)

    BaseController.setResponse({ res, req, resultDTO })

    next()
  }
}

module.exports = UserController
