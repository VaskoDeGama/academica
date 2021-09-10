'use strict'

const ResultDTO = require('../models/result-dto')
const { Roles } = require('../models')

class UserService {
  constructor (userRepository) {
    this.userRepositroy = userRepository
  }

  /**
   *
   * @param {string} role
   * @param {string} userId
   * @param {User[]} users
   * @returns {User[]}
   */
  getOnlyOwned (role, userId, users = []) {
    try {
      return users.filter(user => this.isOwner(role, userId, user))
    } catch (e) {
      throw new Error(`getOwned failed: ${e.message}`)
    }
  }

  /**
   *
   * @param {string} role
   * @param {string} userId
   * @param {User} userForCheck
   * @param {boolean} excludeSelf
   * @returns {boolean}
   */
  isOwner (role, userId, userForCheck, excludeSelf = false) {
    try {
      switch (role) {
        case Roles.student: {
          return !excludeSelf && userForCheck.id === userId
        }
        case Roles.teacher: {
          return (!excludeSelf && userForCheck.id === userId) || userForCheck?.teacher?.toString() === userId || userForCheck?.teacher?.id === userId
        }
        case Roles.admin: {
          return true
        }
        default: {
          return false
        }
      }
    } catch (e) {
      throw new Error(`getOwned failed: ${e.message}`)
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async getUsers (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    const { hasQuery, query, user } = reqDTO
    const users = []

    const opt = {
      populate: {
        path: `${user.role === 'teacher' ? 'students' : 'teacher'}`,
        select: `-students -teacher -createdAt -updatedAt -role${user.role === 'teacher' ? ' +balance +username' : ' -balance -username'}`
      }
    }

    const select = {
      createdAt: 0,
      updatedAt: 0,
      students: 0
    }

    try {
      if (hasQuery) {
        users.push(...await this.userRepositroy.findByQuery(query, select, opt))
      } else {
        users.push(...await this.userRepositroy.getAll(select, opt))
      }

      const result = this.getOnlyOwned(user.role, user.id, users)

      if (result.length) {
        resDTO.data = {
          count: result.length,
          users: result
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
    const resDTO = new ResultDTO(reqDTO)

    try {
      const { hasParams, params, user } = reqDTO

      const opt = {
        populate: {
          path: `${user.role === 'teacher' ? 'students' : 'teacher'}`,
          select: `-students -teacher -createdAt -updatedAt -role${user.role === 'teacher' ? ' +balance +username' : ' -balance -username'}`
        }
      }

      const select = {
        createdAt: 0,
        updatedAt: 0
      }

      if (hasParams) {
        const searchedUser = await this.userRepositroy.findById(params.id, select, opt)

        if (searchedUser && this.isOwner(user.role, user.id, searchedUser)) {
          resDTO.data = searchedUser
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
      const { hasParams, params, hasQuery, query, user } = reqDTO
      if (hasParams && params.id === user.id) {
        return resDTO.addError('Bad ID', 400)
      }

      if (hasQuery) {
        if (Array.isArray(query.id) && query.id.some(id => id === user.id)) {
          return resDTO.addError('Bad ID', 400)
        } else if (query.id === user.id) {
          return resDTO.addError('Bad ID', 400)
        }
      }
      const ids = []

      const userForDelete = await this.userRepositroy.findByIds(ids)

      if (hasParams) {
        if (this.isOwner(user.role, user.id, userForDelete)) {
          result = await this.userRepositroy.removeById(params.id)
        }
      } else if (hasQuery && Array.isArray(query.id)) {
        const users = await this.userRepositroy.findByIds(query.id)
        const usersForDelete = this.getOnlyOwned(user.role, user.id, users)

        if (usersForDelete.length === users.length) {
          result = await this.userRepositroy.removeByIds(query.id)
        }
      } else if (hasQuery) {
        const userForDelete = await this.userRepositroy.findById(query.id)
        if (this.isOwner(user.role, user.id, userForDelete)) {
          result = await this.userRepositroy.removeById(query.id)
        }
      }

      if (result && result.deletedCount) {
        resDTO.data = result.deletedCount
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
      resDTO.data = result.id
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
   * @param {object} body
   * @param {string[]} mutableFields
   * @returns {{}|null}
   */
  checkUpdate (body, mutableFields = []) {
    if (!mutableFields.length) {
      return true
    }

    for (const key of Object.keys(body)) {
      if (!mutableFields.includes(key)) {
        return false
      }
    }

    return true
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async updateUser (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    try {
      const { hasParams, params, body, user } = reqDTO

      if (!this.checkUpdate(body, user.mutableFields)) {
        return resDTO.addError('Bad request', 400)
      }

      if (hasParams) {
        const userForUpdate = await this.userRepositroy.findById(params.id)

        if (userForUpdate && this.isOwner(user.role, user.id, userForUpdate)) {
          const result = await this.userRepositroy.findAndUpdate({ id: params.id }, body)

          if (result.id === userForUpdate.id) {
            resDTO.data = result.id
            return resDTO
          }
        }
      }

      return resDTO.addError('Users not found', 404)
    } catch (error) {
      return resDTO.addError(error)
    }
  }
}

module.exports = UserService
