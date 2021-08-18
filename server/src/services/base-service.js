'use strict'

/**
 * @typedef {object} Service
 * @property {Repository} repo - {@link Repository}
 */

class BaseService {
  /**
   * @param {Repository} repo - an instance of Repository
   */
  constructor (repo) {
    /** @param {Repository} */
    this.repo = repo
  }
}

module.exports = BaseService
