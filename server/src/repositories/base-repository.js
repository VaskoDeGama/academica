'use strict'

const { model, Schema } = require('mongoose')

class BaseRepository {
  constructor (name, schemaDefinition) {
    /** @type {string}  */
    this._name = name

    const schema = new Schema(schemaDefinition, { timestamps: true, id: true })

    schema.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) { delete ret._id }
    })

    /** @type {Model} **/
    this.model = model(this._name, schema)
  }
}

module.exports = BaseRepository
