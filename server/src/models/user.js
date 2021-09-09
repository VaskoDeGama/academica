'use strict'

const { model, Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const { Roles } = require('./role')

const userScheme = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    immutable: true
  },
  password: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  skype: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    createIndexes: { unique: true, sparse: true }
  },
  balance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: [Roles.student, Roles.admin, Roles.teacher],
    default: Roles.student
  },
  teacher: { type: Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}

const schema = new Schema(userScheme, { timestamps: true, id: true })

schema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
    delete ret.password
  }
})

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

schema.methods.validatePassword = async function validatePassword (data) {
  return bcrypt.compare(data, this.password)
}

const User = model('User', schema)
module.exports = { User, userScheme }
