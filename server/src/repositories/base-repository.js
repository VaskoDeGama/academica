const { model, Schema } = require('mongoose')

class BaseRepository {
  constructor (name, schemaDefinition) {
    this._name = name
    const schema = new Schema(schemaDefinition, { collection: this._name, timestamps: true })
    this._model = model(this._name, schema)
  }

  async findAll () {
    const res = await this._model.find()
    return res.map((r) => this._readMapper(r))
  }

  async findById (id) {
    const res = await this._model.findById(id)
    return this._readMapper(res)
  }

  async save (doc) {
    const instance = new this._model(doc)
    const res = await instance.save()
    return this._readMapper(res)
  }

  async findManyById (ids) {
    const query = { _id: { $in: ids } }
    const res = await this._model.find(query)
    return res.map((r) => this._readMapper(r))
  }

  async findManyByQuery (query) {
    const res = await this._model.find(query)
    return res.map((r) => this._readMapper(r))
  }

  _readMapper (model) {
    const obj = model.toJSON()
    Object.defineProperty(obj, 'id', Object.getOwnPropertyDescriptor(obj, '_id'))
    delete obj._id
    return obj
  }
}

module.exports = BaseRepository
