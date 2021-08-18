'use strict'

const BaseService = require('./base-service')
const userRepo = require('./../repositories/user-repository')

class UserService extends BaseService {
  /**
   * Get User by id
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async getUserById (dto) {
    try {
      const result = await this.repo.findById(dto.request.params.id)
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

  /**
   * Get Users by ids
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async getUsersByIds (dto) {
    try {
      const result = await this.repo.findManyById(dto.request.query.id)
      if (result) {
        dto.data = result
      } else {
        dto.addError('Users not found', 404)
      }

      return dto
    } catch (error) {
      return dto.addError(error)
    }
  }

  /**
   * Get all Users
   *
   * @param {DTO} dto
   * @returns {Promise<object[]>}
   */
  async getAllUsers (dto) {
    try {
      dto.data = await this.repo.findAll()
      return dto
    } catch (error) {
      return dto.addError(error)
    }
  }

  /**
   * Get all Users
   *
   * @param {DTO} dto
   * @returns {Promise<object[]>}
   */
  async getUsersByQuery (dto) {
    try {
      dto.data = await this.repo.findManyByQuery(dto.request.query)
      return dto
    } catch (error) {
      return dto.addError(error)
    }
  }
}

module.exports = new UserService(userRepo)
