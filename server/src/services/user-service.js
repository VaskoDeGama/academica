'use strict'

const ResultDTO = require('../models/result-dto')

class UserService {
  constructor (userRepository) {
    this.userRepositroy = userRepository
    this.options = {
      populate:
        [
          { path: 'students', select: '-createdAt -updatedAt -teacher' },
          { path: 'teacher', select: '-createdAt -updatedAt -students' }
        ]
    }
    this.select = { createdAt: 0, updatedAt: 0 }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async getUsers (reqDTO) {
    // TODO add onlyOwned check
    const resDTO = new ResultDTO(reqDTO)
    const { hasQuery, query } = reqDTO
    const users = []
    try {
      if (hasQuery) {
        // TODO разбор query
        users.push(...await this.userRepositroy.findByQuery(query, this.select, this.options))
      } else {
        users.push(...await this.userRepositroy.getAll(this.select, this.options))
      }

      if (users.length) {
        resDTO.data = {
          count: users.length,
          users
        }
        return resDTO
      } else {
        return resDTO.addError('Resource not found', 404)
      }
    } catch (e) {
      return resDTO.addError(e)
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async getUser (reqDTO) {
    // TODO add onlyOwned check
    const resDTO = new ResultDTO(reqDTO)

    try {
      const { hasParams, params } = reqDTO

      if (hasParams) {
        const user = await this.userRepositroy.findById(params.id, this.select, this.options)

        if (user) {
          resDTO.data = user
          return resDTO
        }
      }

      return resDTO.addError('Resource not found', 404)
    } catch (error) {
      return resDTO.addError(error)
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async removeUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    let result = {}
    try {
      const { hasParams, params, hasQuery, query } = reqDTO

      if (hasParams) {
        result = await this.userRepositroy.removeById(params.id)
      } else if (hasQuery && Array.isArray(query.id)) {
        result = await this.userRepositroy.removeByIds(query.id)
      }

      if (result && result.deletedCount) {
        resDTO.data = {
          deletedCount: result.deletedCount
        }
        return resDTO
      }

      return resDTO.addError('Resource not found', 404)
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
