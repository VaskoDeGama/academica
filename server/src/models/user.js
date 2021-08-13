const userSchema = {
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
  lastName: { type: String },
  firstName: { type: String },
  skype: { type: String },
  email: { type: String },
  balance: { type: String, default: 0 }
}

module.exports = userSchema
