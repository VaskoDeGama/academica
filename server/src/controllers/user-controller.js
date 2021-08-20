'use strict'

const BaseController = require('./base-controller')
const userService = require('../services/user-service')
const RequestDTO = require('../models/request-dto')

class UserController extends BaseController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async post (req, res) {
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.createUser(reqDTO)

    return BaseController.setResponse({ res, req, resultDTO })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async get (req, res) {
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.getUser(reqDTO)

    return BaseController.setResponse({ res, req, resultDTO })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async update (req, res) {
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.updateUser(reqDTO)

    return BaseController.setResponse({ res, req, resultDTO })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async delete (req, res) {
    // TODO: валидация
    const reqDTO = new RequestDTO(req)

    const resultDTO = await this.service.removeUser(reqDTO)

    return BaseController.setResponse({ res, req, resultDTO })
  }
}

module.exports = new UserController(userService)
