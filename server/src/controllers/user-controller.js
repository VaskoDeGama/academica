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
  async create (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    await this.service.createUser(dto)

    return dto.success ? this.ok(res, dto) : this.fail({ req, res, dto })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response|Request>}
   */
  async getByQuery (req, res) {
    // TODO: валидация
    const dto = new DTO(req)

    if (dto.request.hasQuery) {
      if (Array.isArray(dto.request.query.id)) {
        await this.service.getUsersByIds(dto)
      } else {
        await this.service.getUsersByQuery(dto)
      }
    } else {
      await this.service.getAllUsers(dto)
    }

    return dto.success ? this.ok(res, dto) : this.fail({ req, res, dto })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response|Request>}
   */
  async getById (req, res) {
    const dto = new DTO(req)
    await this.service.getUserById(dto)
    return dto.success ? this.ok(res, dto) : this.fail({ req, res, dto })
  }
}

module.exports = new UserController(userService)
