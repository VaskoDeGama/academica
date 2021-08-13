'use strict'

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
    return this._repo.findById(id)
  }

  /**
   * Get all records
   *
   * @returns {Promise<object[]>}
   */
  async getAll () {
    return this._repo.findAll()
  }

  /**
   * Create one record
   *
   * @param {object} doc
   * @returns {Promise<object>}
   */
  async createOne (doc) {
    return this._repo.save(doc)
  }

  /**
   * Delete one record
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async deleteById (id) {
    return this._repo.removeById(id)
  }

  /**
   * Get many record  by id
   *
   * @param {string[]} ids
   * @returns {Promise<object[]>}
   */
  async getByIds (ids) {
    return this._repo.findManyById(ids)
  }
}

module.exports = BaseService
