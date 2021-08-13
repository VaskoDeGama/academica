const userSchema = {
  username: { type: String, required: true },
  password: { type: String, required: true },
  lastName: { type: String },
  firstName: { type: String },
  skype: { type: String },
  email: { type: String },
  role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
  balance: { type: String, default: 0 }
}

module.exports = userSchema
