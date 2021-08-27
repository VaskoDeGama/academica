'use strict'

const ResultDTO = require('../models/result-dto')

class UserService {
  constructor (userRepository) {
    this.userRepositroy = userRepository
  }

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
        const user = await this.userRepositroy.findById(params.id)

        if (user) {
          resDTO.data = user
          return resDTO
        }
      } else if (hasQuery) {
        if (Array.isArray(query.id)) {
          const users = await this.userRepositroy.findByIds(query.id)
          if (Array.isArray(users) && users.length) {
            resDTO.data = {
              count: users.length,
              users
            }
            return resDTO
          }
        }

        const users = await this.userRepositroy.findByQuery(reqDTO.query)
        if (Array.isArray(users) && users.length) {
          resDTO.data = {
            count: users.length,
            users
          }

          return resDTO
        }
      } else {
        // get all
        const users = await this.userRepositroy.getAll()

        resDTO.data = {
          count: users.length,
          users
        }
        return resDTO
      }

      return resDTO.addError('Users not found', 404)
    } catch (error) {
      return resDTO.addError(error)
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
      const users = await this.userRepositroy.findByQuery({
        $or: [
          { username: reqDTO.body.username },
          { email: reqDTO.body.email }
        ]
      })

      if (users.length) {
        return resDTO.addError('Same user already exists.', 409)
      }
    } catch (e) {
      return resDTO.addError(e)
    }

    try {
      const result = await this.userRepositroy.save(reqDTO.body)
      resDTO.data = {
        id: result.id
      }
      resDTO.status = 201
      return resDTO
    } catch (error) {
      switch (error.code) {
        case 11000: {
          return resDTO.addError('Same user already exists.', 409)
        }
        default: {
          return resDTO.addError(error)
        }
      }
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
        const result = await this.userRepositroy.removeById(params.id)
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
          const result = await this.userRepositroy.removeByIds(id)
          if (result && result.deletedCount) {
            resDTO.data = {
              deletedCount: result.deletedCount
            }
            return resDTO
          }
        } else {
          const result = await this.userRepositroy.removeByQuery(query)

          if (result && result.deletedCount) {
            resDTO.data = {
              deletedCount: result.deletedCount
            }
            return resDTO
          }
        }
      }

      return resDTO.addError('Users not found', 404)
    } catch (error) {
      return resDTO.addError(error)
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
        const result = await this.userRepositroy.findAndUpdate({ id: params.id }, body)

        if (result && result.id === params.id) {
          resDTO.data = {
            id: result.id
          }
          return resDTO
        }
      }

      return resDTO.addError('Users not found', 404)
    } catch (error) {
      return resDTO.addError(error)
    }
  }
}

module.exports = UserService
