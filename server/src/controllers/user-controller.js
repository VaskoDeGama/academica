'use strict'

const BaseController = require('./base-controller')
const userService = require('../services/user-service')
const DTO = require('../models/DTO')
class UserController extends BaseController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response|Request>}
   */
  async getAll (req, res) {
    // TODO: валидация
    const dto = new DTO(req)
    const resultDTO = await this._service.getAll(dto)
    return dto.success ? this.ok(res, resultDTO) : this.fail(req, res, resultDTO)
  }
}

module.exports = new UserController(userService)
