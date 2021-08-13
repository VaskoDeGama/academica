'use strict'

const mock = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' }
}

module.exports = mock
