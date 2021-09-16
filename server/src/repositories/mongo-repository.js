'use strict'

class MongoRepository {
  constructor (model) {
    this.Model = model
  }

  /**
   * @param {object} [select={}] - {field1: 1, filed2: 0} 1-include, 0-exclude
   * @param {object} [options={}] - other options for mongoose find
   * @returns {Promise<object[]>}
   */
  async getAll (select, options) {
    return this.Model.find({}, select, options)
  }

  /**
   * @param {string} id - _id value
   * @param {object} select - {field1: 1, filed2: 0} 1-include, 0-exclude
   * @param {object} options - other options for mongoose find
   * @returns {Promise<object|null>}
   */
  async findById (id, select = {}, options = {}) {
    return this.Model.findById(id, select, options)
  }

  /**
   * @param {string[]} ids
   * @param {object} select - {field1: 1, filed2: 0} 1-include, 0-exclude
   * @param {object} options - other options for mongoose find
   * @returns {Promise<object[]>}
   */
  async findByIds (ids, select = {}, options = {}) {
    const query = { _id: { $in: ids } }
    return this.Model.find(query, select, options)
  }

  /**
   * @param {object} query
   * @param {object} select - {field1: 1, filed2: 0} 1-include, 0-exclude
   * @param {object} options - other options for mongoose find
   * @returns {Promise<object[]>}
   */
  async findByQuery (query, select = {}, options = {}) {
    return this.Model.find(this.checkId(query), select, options)
  }

  /**
   * @param {object} doc
   * @param {object} options - other options for mongoose save
   * @returns {Promise<object>}
   */
  async save (doc, options = {}) {
    const user = new this.Model(this.checkId(doc))
    return user.save(options)
  }

  /**
   * @param {string} id
   * @param {object} [options={}] - other options for mongoose deleteOne
   * @returns {Promise<object>}
   */
  async removeById (id, options = {}) {
    return this.Model.deleteOne({ _id: id }, options)
  }

  /**
   * @param {string[]} ids
   * @param {object} [options={}] - other options for mongoose deleteMany
   * @returns {Promise<object>}
   */
  async removeByIds (ids, options = {}) {
    return this.Model.deleteMany({ _id: { $in: ids } }, options)
  }

  /**
   * @param {object} query - mongoose filter
   * @param {object} [options={}] - other options for mongoose deleteMany
   * @returns {Promise<object>}
   */
  async removeByQuery (query, options = {}) {
    return this.Model.deleteMany(this.checkId(query), options)
  }

  /**
   *
   * @param {object} conditions - mongoose filter
   * @param {object} update - update fields
   * @param {object} [options={}] - other options for mongoose findOneAndUpdate
   * @returns {Promise<object>}
   */
  async findAndUpdate (conditions, update, options) {
    return this.Model.findOneAndUpdate(this.checkId(conditions), update, { new: true })
  }

  /**
   * check id field and replace on _id
   *
   * @param {object} query
   * @returns {object}
   */
  checkId (query) {
    const queryObject = Object.assign({}, query)

    if (Reflect.has(queryObject, 'id')) {
      queryObject._id = queryObject.id
      delete queryObject.id
    }
    return queryObject
  }
}

module.exports = MongoRepository
