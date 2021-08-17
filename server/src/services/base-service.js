'use strict'

/**
 * @class
 * @classdesc BaseService
 * @name BaseService
 * @property {Function} getAll {@link getAll}
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
   * Get all records
   *
   * @param {DTO} dto
   * @returns {Promise<object[]>}
   */
  async getAll (dto) {
    try {
      dto.data = await this._repo.findAll()
      return dto
    } catch (error) {
      return dto.addError(error)
    }
  }
}

module.exports = BaseService
