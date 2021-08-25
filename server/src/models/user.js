'use strict'

const { model, Schema } = require('mongoose')
const getMongoSchemeDefinition = require('../utils/get-mongo-scheme-definition')
const { isMongoId, isNumeric, isEmail, isLength, isAlphanumeric, isAlpha } = require('validator')

const userScheme = {
  id: {
    type: String,
    unique: true,
    validators: [{ fn: isMongoId, message: 'Bad ID' }],
    fields: ['query', 'params']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validators: [
      { fn: isAlphanumeric, message: 'Username must contain only letters and numbers' },
      { fn: isLength, options: { min: 6, max: 16 }, message: 'Username must be longer than 6 and shorter than 16 characters' }
    ]
  },
  password: {
    type: String,
    required: true,
    select: false,
    validators: [
      { fn: isLength, options: { min: 8 }, message: 'Password must be longer then 8 characters' }
    ]
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'teacher'],
    default: 'student'
  },
  lastName: {
    type: String,
    validators: [
      { fn: isLength, options: { min: 2 }, message: 'LastName must be longer than 2 characters' },
      { fn: isAlpha, message: 'LastName must contain only letters' }
    ]
  },
  firstName: {
    type: String,
    validators: [
      { fn: isLength, options: { min: 2 }, message: 'FirstName must be longer than 2 characters' },
      { fn: isAlpha, message: 'FirstName must contain only letters' }
    ]
  },
  skype: {
    type: String,
    validators: [
      { fn: isLength, options: { min: 6 }, message: 'Skype must be longer than 6 characters' }
    ]
  },
  email: {
    unique: true,
    type: String,
    validators: [
      { fn: isEmail, message: 'Wrong Email' }
    ]
  },
  balance: {
    type: Number,
    default: 0,
    validators: [
      { fn: isNumeric, message: 'Balance must be numeric' }
    ]
  }
}

const userSchemaDefinition = getMongoSchemeDefinition(userScheme)

const schema = new Schema(userSchemaDefinition, { timestamps: true, id: true })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

schema.index({
  id: 1,
  email: 1
}, {
  unique: true
})

const User = model('User', schema)
module.exports = { User, userSchemaDefinition, userScheme }
