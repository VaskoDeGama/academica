'use strict'

const DTO = require('../models/DTO')

/**
 * @class
 * @classdesc BaseService
 * @name BaseService
 * @property {Function} getById {@link getById}
 * @property {Function} getAll {@link getAll}
 * @property {Function} getByIds {@link getByIds}
 * @property {Function} createOne {@link createOne}
 * @property {Function} deleteById {@link deleteById}
 */
class BaseService {
  /**
   * @param {BaseRepository} repo - an instance of the Repository class
   */
  constructor (repo) {
    /** @param {BaseRepository} */
    this._repo = repo
  }

  /**
   * Find one entry and return the result.
   *
   * @function
   * @param {string} id
   * @returns {Promise<object | null>}
   */
  async getById (id) {
    try {
      const data = await this._repo.findById(id)
      return new DTO({ success: true, data })
    } catch (error) {
      return new DTO({ success: false, error })
    }
  }

  /**
   * Get all records
   *
   * @returns {Promise<object[]>}
   */
  async getAll () {
    try {
      const data = await this._repo.findAll()
      return new DTO({ success: true, data })
    } catch (error) {
      return new DTO({ success: false, error })
    }
  }

  /**
   * Create one record
   *
   * @param {object} doc
   * @returns {Promise<object>}
   */
  async createOne (doc) {
    try {
      const data = await this._repo.save(doc)
      return new DTO({ success: true, data })
    } catch (error) {
      return new DTO({ success: false, error })
    }
  }

  /**
   * Delete one record
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async deleteById (id) {
    try {
      const data = await this._repo.removeById(id)
      return new DTO({ success: true, data })
    } catch (error) {
      return new DTO({ success: false, error })
    }
  }

  /**
   * Get many record  by id
   *
   * @param {string[]} ids
   * @returns {Promise<object[]>}
   */
  async getByIds (ids) {
    try {
      const data = await this._repo.findManyById(ids)
      return new DTO({ success: true, data })
    } catch (error) {
      return new DTO({ success: false, error })
    }
  }
}

module.exports = BaseService
