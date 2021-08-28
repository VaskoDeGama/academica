const { isAlphanumeric, isLength } = require('validator')
const loginScheme = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validators: [
      { fn: isAlphanumeric, message: 'Username must contain only letters and numbers' },
      { fn: isLength, options: { min: 6, max: 16 }, message: 'Username must be longer than 6 and shorter than 16 characters' }
    ]
  },
  password: {
    type: String,
    required: true,
    validators: [
      { fn: isLength, options: { min: 8 }, message: 'Password must be longer then 8 characters' }
    ]
  }
}

module.exports = {
  loginScheme
}
