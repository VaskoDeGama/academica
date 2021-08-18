'use strict'

const BaseController = require('./base-controller')
const userService = require('../services/user-service')
const DTO = require('../models/DTO')

class UserController extends BaseController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response|Request>}
   */
  async getByQuery (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    if (dto.request.hasQuery) {
      // TODO:  реализовать
      await this._service.getUsersByQuery(dto)
    } else {
      await this._service.getAll(dto)
    }

    if (dto.success) {
      return this.ok(res, dto)
    }

    return this.fail(req, res, dto)
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response|Request>}
   */
  async getById (req, res) {
    const dto = new DTO(req)
    const resultDTO = await this._service.getUserById(dto)

    if (dto.success) {
      return this.ok(res, resultDTO)
    }

    return this.fail(req, res, resultDTO)
  }
}

module.exports = new UserController(userService)
