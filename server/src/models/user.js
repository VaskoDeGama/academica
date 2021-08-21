'use strict'

const { model, Schema } = require('mongoose')

const userSchemaDefinition = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
  lastName: { type: String },
  firstName: { type: String },
  skype: { type: String },
  email: { type: String },
  balance: { type: String, default: 0 }
}

const schema = new Schema(userSchemaDefinition, { timestamps: true, id: true })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

const User = model('User', schema)
module.exports = User
