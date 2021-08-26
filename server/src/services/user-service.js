'use strict'

const BaseService = require('./base-service')
const ResultDTO = require('../models/result-dto')

class UserService extends BaseService {
  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async getUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    try {
      const { hasParams, hasQuery, query, params } = reqDTO

      if (hasParams) {
        const user = await this.repo.findUserById(params.id)

        if (user) {
          resDTO.data = user
          return resDTO
        }
      } else if (hasQuery) {
        if (Array.isArray(query.id)) {
          const users = await this.repo.findUsersByIds(query.id)
          if (Array.isArray(users) && users.length) {
            resDTO.data = {
              count: users.length,
              users
            }
            return resDTO
          }
        }

        const users = await this.repo.findUsersByQuery(reqDTO.query)
        if (Array.isArray(users) && users.length) {
          resDTO.data = {
            count: users.length,
            users
          }

          return resDTO
        }
      } else {
        // get all
        const users = await this.repo.getAllUsers()

        resDTO.data = {
          count: users.length,
          users
        }
        return resDTO
      }

      resDTO.addError('Users not found', 404)
      return resDTO
    } catch (error) {
      resDTO.addError(error)
      return resDTO
    }
  }

  /**
   * Create user
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async createUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    try { // check exits users
      const users = await this.repo.findUsersByQuery({
        $or: [
          { username: reqDTO.body.username },
          { email: reqDTO.body.email }
        ]
      })

      if (users.length) {
        resDTO.addError('Same user already exists.', 409)
        return resDTO
      }
    } catch (e) {
      resDTO.addError(e)
      return resDTO
    }

    try {
      const result = await this.repo.saveUser(reqDTO.body)
      resDTO.data = {
        id: result.id
      }
      resDTO.status = 201
      return resDTO
    } catch (error) {
      switch (error.code) {
        case 11000: {
          resDTO.addError('Same user already exists.', 409)
          break
        }
        default: {
          resDTO.addError(error)
        }
      }
      return resDTO
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async removeUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    try {
      const { hasParams, params, hasQuery, query } = reqDTO

      if (hasParams) {
        const result = await this.repo.removeUserById(params.id)
        if (result && result.deletedCount) {
          resDTO.data = {
            deletedCount: result.deletedCount
          }
          return resDTO
        }
      }

      if (hasQuery) {
        const { id } = query

        if (Array.isArray(id)) {
          const result = await this.repo.removeUsersByIds(id)
          if (result && result.deletedCount) {
            resDTO.data = {
              deletedCount: result.deletedCount
            }
            return resDTO
          }
        } else {
          const result = await this.repo.removeUsersByQuery(query)

          if (result && result.deletedCount) {
            resDTO.data = {
              deletedCount: result.deletedCount
            }
            return resDTO
          }
        }
      }

      resDTO.addError('Users not found', 404)
      return resDTO
    } catch (error) {
      resDTO.addError(error)
      return resDTO
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async updateUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    try {
      const { hasParams, params, body } = reqDTO
      if (hasParams) {
        const result = await this.repo.findUserAndUpdate(params.id, body)

        if (result && result.id === params.id) {
          resDTO.data = {
            id: result.id
          }
          return resDTO
        }
      }

      resDTO.addError('Users not found', 404)
      return resDTO
    } catch (error) {
      resDTO.addError(error)
      return resDTO
    }
  }
}

module.exports = UserService
