'use strict'

const { model, Schema } = require('mongoose')

/**
 * @class
 * @classdesc BaseRepository
 * @name BaseRepository
 * @property {Function} findAll {@link findAll}
 * @property {Function} findById {@link findById}
 * @property {Function} save {@link save}
 * @property {Function} findManyById {@link findManyById}
 * @property {Function} findManyByQuery {@link findManyByQuery}
 * @property {Function} removeById {@link removeById}
 * @property {Function} removeManyByQuery {@link removeManyByQuery}
 */
class BaseRepository {
  /**
   *
   * @param {string} name
   * @param {object} schemaDefinition
   */
  constructor (name, schemaDefinition) {
    this._name = name
    const schema = new Schema(schemaDefinition, { collection: this._name, timestamps: true, id: false })
    this._model = model(this._name, schema)
  }

  /**
   * Get all from collection
   *
   * @returns {Promise<object[]>}
   */
  async findAll () {
    return this._model.find()
  }

  /**
   * Get one by id
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById (id) {
    return this._model.findById(id)
  }

  /**
   * Save one to db
   *
   * @param {object} doc
   * @returns {Promise<object>}
   */
  async save (doc) {
    const instance = new this._model(doc)
    return instance.save()
  }

  /**
   * Get many by ids
   *
   * @param {string[]} ids
   * @returns {Promise<object[]>}
   */
  async findManyById (ids) {
    const query = { _id: { $in: ids } }
    return this._model.find(query)
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object[]>}
   */
  async findManyByQuery (query) {
    return this._model.find(query)
  }

  /**
   * Remove one by id
   *
   * @param {string} id
   * @returns {Promise<object[]>}
   */
  async removeById (id) {
    return this._model.deleteOne({ _id: id })
  }

  /**
   * Remove many by query
   *
   * @param {object} query
   * @returns {Promise<object[]>}
   */
  async removeManyByQuery (query) {
    return this._model.deleteMany(query)
  }
}

module.exports = BaseRepository
