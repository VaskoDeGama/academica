'use strict'

const BaseService = require('./base-service')
const userRepo = require('./../repositories/user-repository')
const isId = require('../utils/is-id')
const { query } = require('express')

class UserService extends BaseService {
  /**
   *
   * @param {DTO} dto
   * @returns {Promise<DTO>}
   */
  async getUser (dto) {
    try {
      let users = null
      if (dto.request.hasParams) {
        const { id } = dto.request.params
        users = isId(id) ? await this.repo.findUserById(id) : null
      } else if (dto.request.hasQuery) {
        if (Reflect.has(dto.request.query, 'id') && Array.isArray(dto.request.query.id)) {
          const { id: ids = [] } = dto.request.query
          users = ids.every(isId) ? await this.repo.findUsersByIds(ids) : null
        } else {
          if (Reflect.has(dto.request.query, 'id')) {
            const { id } = dto.request.query
            users = isId(id) ? await this.repo.findUsersByQuery(dto.request.query) : null
          } else {
            users = await this.repo.findUsersByQuery(dto.request.query)
          }
        }
      } else {
        users = await this.repo.getAllUsers()
      }

      if (Array.isArray(users) && users.length) {
        dto.data = {
          count: users.length,
          users
        }
      } else if (users && typeof users === 'object') {
        dto.data = users
      } else {
        dto.addError('Users not found', 404)
      }
      return dto
    } catch (error) {
      dto.addError(error)
      return dto
    }
  }

  /**
   * Create user
   *
   * @param {DTO} dto
   * @returns {Promise<DTO>}
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

        // TODO validation error
        default: {
          dto.addError(error)
        }
      }
      return dto
    }
  }

  /**
   *
   * @param {DTO} dto
   * @returns {Promise<DTO>}
   */
  async removeUser (dto) {
    try {
      let result = null
      if (dto.request.hasParams) {
        const { id } = dto.request.params
        result = isId(id) ? await this.repo.removeUserById(id) : null
      } else if (dto.request.hasQuery) {
        if (Reflect.has(dto.request.query, 'id') && Array.isArray(dto.request.query.id)) {
          const { id: ids = [] } = dto.request.query
          result = ids.every(isId) ? await this.repo.removeUsersByIds(ids) : null
        } else {
          result = await this.repo.removeUsersByQuery(dto.request.query)
        }
      }

      if (result && result.deletedCount) {
        dto.data = {
          deletedCount: result.deletedCount
        }
      } else {
        dto.addError('Users not found', 404)
      }

      return dto
    } catch (error) {
      dto.addError(error)
      return dto
    }
  }

  /**
   *
   * @param {DTO} dto
   * @returns {Promise<DTO>}
   */
  async updateUser (dto) {
    try {
      const { id } = dto.request.params
      const result = isId(id) ? await this.repo.findUserAndUpdate(id, dto.request.body) : null

      if (result && result.id === id) {
        dto.data = {
          id: result.id
        }
      } else {
        dto.addError('Users not found', 404)
      }
    } catch (error) {
      dto.addError(error)
      return dto
    }
  }
}

module.exports = new UserService(userRepo)
