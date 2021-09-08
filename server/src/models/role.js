'use strict'

const { model, Schema } = require('mongoose')

const Roles = {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student'
}

const rolesSchema = {
  name: {
    type: String,
    enum: [Roles.admin, Roles.teacher, Roles.student],
    default: Roles.student,
    unique: true
  },
  permissions: [
    {
      resource: { type: String, required: true },
      read: { type: Boolean, default: false, required: true },
      write: { type: Boolean, default: false, required: true },
      delete: { type: Boolean, default: false, required: true },
      onlyOwned: { type: Boolean, default: true, require: true }
    }
  ]
}

const schema = new Schema(rolesSchema, { timestamps: true, id: true })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

const Role = model('Role', schema)
module.exports = { Role, rolesSchema, Roles }
