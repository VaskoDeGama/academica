const { model, Schema } = require('mongoose')
const getMongoSchemeDefinition = require('../utils/get-mongo-scheme-definition')
const mongoose = require('mongoose')
const config = require('config')

const tokenScheme = {
  token: {
    type: String
  },
  createdByIp: String,
  expires: Date,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String
}

const tokenSchemeDefinition = getMongoSchemeDefinition(tokenScheme)
const schema = new Schema(tokenSchemeDefinition, { timestamps: true })

schema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires
})

schema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id
    delete ret.id
    delete ret.user
  }
})

schema.index({ createdAt: 1 }, { expireAfterSeconds: config.server.refreshTokenExp / 1000 })

const Token = model('Token', schema)
module.exports = { Token, tokenSchemeDefinition, tokenScheme }
