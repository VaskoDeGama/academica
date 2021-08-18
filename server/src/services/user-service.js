'use strict'

const BaseService = require('./base-service')
const userRepo = require('./../repositories/user-repository')
const isId = require('../utils/is-id')

class UserService extends BaseService {
  /**
   * Get User by id
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async getUserById (dto) {
    try {
      const { id } = dto.request.params
      const user = isId(id) ? await this.repo.findById(id) : null

      if (user) {
        dto.data = user
      } else {
        dto.addError('User not found', 404)
      }
    } catch (error) {
      dto.addError(error)
    }
    return dto
  }

  /**
   * Get Users by ids
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async getUsersByIds (dto) {
    try {
      const { id: ids = [] } = dto.request.query

      const users = ids.every(isId) ? await this.repo.findManyById(dto.request.query.id) : null

      if (users && users.length) {
        dto.data = {
          count: users.length,
          users
        }
      } else {
        dto.addError('Users not found', 404)
      }
    } catch (error) {
      dto.addError(error)
    }
    return dto
  }

  /**
   * Get all Users
   *
   * @param {DTO} dto
   * @returns {Promise<object[]>}
   */
  async getAllUsers (dto) {
    try {
      const users = await this.repo.findAll()
      dto.data = {
        count: users.length,
        users
      }
    } catch (error) {
      dto.addError(error)
    }
    return dto
  }

  /**
   * Get all Users
   *
   * @param {DTO} dto
   * @returns {Promise<object[]>}
   */
  async getUsersByQuery (dto) {
    try {
      const validId = dto.request.query.id ? isId(dto.request.query.id) : true
      const users = validId ? await this.repo.findManyByQuery(dto.request.query) : null
      if (users && users.length) {
        dto.data = {
          count: users.length,
          users
        }
      } else {
        dto.addError('Users not found', 404)
      }
    } catch (error) {
      dto.addError(error)
    }
    return dto
  }

  /**
   * Create user
   *
   * @param {DTO} dto
   * @returns {Promise<object>}
   */
  async createUser (dto) {
    try {
      const result = await this.repo.saveUser(dto.request.body)
      dto.data = {
        id: result.id
      }
      dto.status = 201
      return dto
    } catch (error) {
      switch (error.code) {
        case 11000: {
          const field = Object.keys(error.keyValue)[0]
          dto.addError(`A user with the same ${field} already exists.`, 409)
          break
        }
        default: {
          dto.addError(error)
        }
      }
      return dto
    }
  }
}

module.exports = new UserService(userRepo)
