'use strict'

const BaseRepository = require('./base-repository')
const userSchema = require('../models/user')

class UserRepository extends BaseRepository {
  /**
   * Get all from collection
   *
   * @returns {Promise<object[]>}
   */
  async findAll () {
    return this.model.find()
  }

  /**
   * Get one by id
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById (id) {
    return this.model.findById(id)
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
  async findManyById (ids) {
    const query = { _id: { $in: ids } }
    return this.model.find(query)
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object[]>}
   */
  async findManyByQuery (query) {
    const queryObject = Object.assign({}, query)

    if (Reflect.has(queryObject, 'id')) {
      queryObject._id = queryObject.id
      delete queryObject.id
    }

    return this.model.find(queryObject)
  }
}

module.exports = new UserRepository('users', userSchema)
