'use strict'

const BaseRepository = require('./base-repository')

class UserRepository extends BaseRepository {
  /**
   * Get all from collection
   *
   * @returns {Promise<object[]>}
   */
  async getAllUsers () {
    return this.model.find()
  }

  /**
   * Get one by id
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findUserById (id) {
    return this.model.findById(id)
  }

  /**
   *
   * @param {string} id
   * @param {object} update
   * @returns {Promise<object>}
   */
  async findUserAndUpdate (id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true })
  }

  /**
   * Save one to db
   *
   * @param {object} doc
   * @returns {Promise<object>}
   */
  async saveUser (doc) {
    // eslint-disable-next-line new-cap
    const user = new this.model(doc)
    return user.save()
  }

  /**
   * Get many by ids
   *
   * @param {string[]} ids
   * @returns {Promise<object[]>}
   */
  async findUsersByIds (ids) {
    const query = { _id: { $in: ids } }
    return this.model.find(query)
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object[]>}
   */
  async findUsersByQuery (query) {
    const queryObject = Object.assign({}, query)

    if (Reflect.has(queryObject, 'id')) {
      queryObject._id = queryObject.id
      delete queryObject.id
    }

    return this.model.find(queryObject)
  }

  /**
   * Get many by query
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async removeUserById (id) {
    return this.model.deleteOne({ _id: id })
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object>}
   */
  async removeUsersByQuery (query) {
    return this.model.deleteMany(query)
  }
}

module.exports = UserRepository
