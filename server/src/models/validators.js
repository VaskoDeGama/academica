'use strict'

const { isMongoId } = require('validator')
const loginSchema = {
  username: {
    in: ['body'],
    exists: true,
    isString: true,
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
    errorMessage: 'Password is required',
    trim: true,
    escape: true,
    isString: true,
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
    errorMessage: 'Username is required',
    trim: true,
    escape: true,
    isString: true,
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
    errorMessage: 'Password is required',
    trim: true,
    isString: true,
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

const userUpdateSchema = {
  password: {
    in: ['body'],
    optional: true,
    trim: true,
    isString: true,
    escape: true,
    isLength: {
      errorMessage: 'Password should be at least 6 chars long',
      options: { min: 6 }
    }
  },
  email: {
    in: ['body'],
    errorMessage: 'Email is not valid',
    optional: true,
    isEmail: true,
    trim: true
  },
  balance: {
    in: ['body'],
    errorMessage: 'Balance should be numeric',
    isNumeric: true,
    optional: true,
    toFloat: true
  },
  lastName: {
    in: ['body'],
    optional: true,
    trim: true
  },
  firstName: {
    in: ['body'],
    optional: true,
    trim: true
  },
  skype: {
    in: ['body'],
    optional: true,
    trim: true
  }
}

const idSchema = {
  id: {
    in: ['params', 'query'],
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (Array.isArray(value)) {
          return value.every(id => isMongoId(id) && req.user.id !== id)
        }

        return isMongoId(value) && req.user.id !== value
      }
    },
    errorMessage: 'Bad ID'

  }
}

module.exports = {
  loginSchema,
  idSchema,
  userSchema,
  userUpdateSchema
}
