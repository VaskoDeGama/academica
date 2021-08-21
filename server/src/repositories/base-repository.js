'use strict'

class BaseRepository {
  /**
   *
   * @param {Model} model
   */
  constructor (model) {
    /** @type {Model} **/
    this.model = model
  }
}

module.exports = BaseRepository
