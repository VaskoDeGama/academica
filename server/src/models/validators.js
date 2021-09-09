'use strict'

const loginSchema = {
  username: {
    in: ['body'],
    exists: true,
    string: true,
    errorMessage: 'Username is required',
    trim: true,
    escape: true,
    isLength: {
      errorMessage: 'Username should be at least 6 chars long',
      options: { min: 6 }
    },
    isAlphanumeric: {
      errorMessage: 'Username must be only numbers and letters'
    }
  },
  password: {
    in: ['body'],
    exists: true,
    string: true,
    errorMessage: 'Password is required',
    trim: true,
    escape: true,
    isLength: {
      errorMessage: 'Password should be at least 6 chars long',
      options: { min: 6 }
    }
  }
}

const userSchema = {
  username: {
    in: ['body'],
    exists: true,
    string: true,
    errorMessage: 'Username is required',
    trim: true,
    escape: true,
    isLength: {
      errorMessage: 'Username should be at least 6 chars long and less then 25 chars',
      options: { min: 6, max: 25 }
    },
    isAlphanumeric: {
      errorMessage: 'Username must be only numbers and letters'
    }
  },
  password: {
    in: ['body'],
    exists: true,
    string: true,
    errorMessage: 'Password is required',
    trim: true,
    escape: true,
    isLength: {
      errorMessage: 'Password should be at least 6 chars long',
      options: { min: 6 }
    }
  },
  email: {
    errorMessage: 'Email is not valid',
    isEmail: true,
    trim: true
  }
}

const idSchema = {
  id: {
    in: ['params', 'query'],
    optional: true,
    string: true,
    errorMessage: 'Bad ID',
    isMongoId: true
  }
}

module.exports = {
  loginSchema,
  idSchema,
  userSchema
}
