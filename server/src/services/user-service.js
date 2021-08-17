'use strict'

const BaseService = require('./base-service')
const userRepo = require('./../repositories/user-repository')

class UserService extends BaseService {
  /**
   * Get records by id
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async getUserById (dto) {
    try {
      const result = await this._repo.findById(dto.request.params.id)
      if (result) {
        dto.data = result
      } else {
        dto.addError('User not found', 404)
      }

      return dto
    } catch (error) {
      return dto.addError(error)
    }
  }
}

module.exports = new UserService(userRepo)
