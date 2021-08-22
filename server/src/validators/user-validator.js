'use strict'

/**
 * @typedef {object} ValidationResult
 * @property {boolean} hasErrors - validation result
 * @property {ValidationError[]} [errors] - validation errors
 */

/**
 * @typedef {object} ValidationError
 * @property {string} field - field where validation failed
 * @property {string} message - message for display
 */

const { User, userScheme } = require('./../models/user')

/**
 *
 * @param {RequestDTO} requestDTO
 * @returns {ValidationResult}
 */
async function userValidator ({ method, query, body, params, hasBody, hasQuery, hasParams }) {
  try {
    const errors = []

    if (hasParams) {
      const entries = Object.entries(params)

      for (const [field, value] of entries) {
        if (Reflect.has(userScheme, field)) {
          const { fields = ['body'], validators = [] } = userScheme[field]
          if (!fields.includes('params')) {
            continue
          }

          for (const validator of validators) {
            const { fn, options, message } = validator || {}
            const validationResult = fn(value, options)

            if (!validationResult) {
              errors.push({
                field,
                message
              })
            }
          }
        }
      }
    }

    if (hasQuery) {
      const entries = Object.entries(query)

      for (const [field, value] of entries) {
        if (Reflect.has(userScheme, field)) {
          const { fields = ['body'], validators = [] } = userScheme[field]
          if (!fields.includes('query')) {
            continue
          }

          for (const validator of validators) {
            const { fn, options, message } = validator || {}

            let validationResult = true

            if (Array.isArray(value)) {
              validationResult = value.every(s => fn(s, options))
            } else {
              validationResult = fn(value, options)
            }

            if (!validationResult) {
              errors.push({
                field,
                message
              })
            }
          }
        }
      }
    }

    if (hasBody) {
      const entries = Object.entries(body)

      const lostRequiredFields = Object.entries(userScheme).reduce((reqFields, [field, value]) => {
        if (value.required && !Reflect.has(body, field)) {
          reqFields.push(field)
        }

        return reqFields
      }, [])

      if (lostRequiredFields.length && method === 'POST') {
        for (const field of lostRequiredFields) {
          errors.push({
            field,
            message: `Field ${field} is required!`
          })
        }
      } else {
        for (const [field, value] of entries) {
          if (Reflect.has(userScheme, field)) {
            const { validators = [], unique, enum: signification } = userScheme[field]

            if (method === 'POST') {
              if (unique) {
                const dbQuery = {}
                dbQuery[field] = value
                const queryResult = await User.find(dbQuery)

                if (queryResult.length) {
                  errors.push({
                    field,
                    message: `User with same ${field} already exist`
                  })

                  break
                }
              }

              if (signification && signification.length) {
                if (!signification.includes(value)) {
                  errors.push({
                    field,
                    message: `Field ${field} should be one of "${signification.join(', ')}"`
                  })
                }
              }
            }

            for (const validator of validators) {
              const { fn, options, message } = validator || {}

              let validationResult = true
              const valueType = typeof value

              if (Array.isArray(value)) {
                validationResult = value.every(s => fn(s, options))
              } else if (['string', 'number', 'boolean'].includes(valueType)) {
                validationResult = fn(`${value}`, options)
              }
              // TODO: object validation

              if (!validationResult) {
                errors.push({
                  field,
                  message
                })
              }
            }
          }
        }
      }
    }

    return {
      hasErrors: errors.length > 0,
      errors
    }
  } catch (e) {
    return {
      hasErrors: true,
      errors: [
        {
          msg: e.message,
          type: e.name
        }
      ]
    }
  }
}

module.exports = userValidator
