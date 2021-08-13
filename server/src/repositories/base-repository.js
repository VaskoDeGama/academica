const { model, Schema } = require('mongoose')

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
   * @return {Promise<object[]>}
   */
  findAll () {
    return this._model.find()
  }

  /**
   *
   * @param {string} id
   * @return {Promise<object|null>}
   */
  findById (id) {
    return this._model.findById(id)
  }

  /**
   * @param {object} doc
   * @return {Promise<object>}
   */
  save (doc) {
    const instance = new this._model(doc)
    return instance.save()
  }

  /**
   * @param {string[]} ids
   * @return {Promise<object[]>}
   */
  async findManyById (ids) {
    const query = { _id: { $in: ids } }
    return this._model.find(query)
  }

  /**
   * @param {object} query
   * @return {Promise<object[]>}
   */
  async findManyByQuery (query) {
    return this._model.find(query)
  }
}

module.exports = BaseRepository
