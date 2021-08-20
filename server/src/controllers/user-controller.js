'use strict'

const BaseController = require('./base-controller')
const userService = require('../services/user-service')
const DTO = require('../models/DTO')

class UserController extends BaseController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async post (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    await this.service.createUser(dto)

    return BaseController.setResponse({ res, req, dto })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async get (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    await this.service.getUser(dto)

    return BaseController.setResponse({ res, req, dto })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async update (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    await this.service.updateUser(dto)

    return BaseController.setResponse({ res, req, dto })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  async delete (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    await this.service.removeUser(dto)

    return BaseController.setResponse({ res, req, dto })
  }
}

module.exports = new UserController(userService)
