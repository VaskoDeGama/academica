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

/**
 *
 * @param {RequestDTO} requestDTO
 * @param {object} scheme
 * @returns {ValidationResult}
 */
function validator ({ method, query, body, params, hasBody, hasQuery, hasParams }, scheme) {
  try {
    const errors = []

    if (hasParams) {
      const entries = Object.entries(params)

      for (const [field, value] of entries) {
        if (Reflect.has(scheme, field)) {
          const { fields = ['body'], validators = [] } = scheme[field]
          if (!fields.includes('params')) {
            continue
          }

          for (const validator of validators) {
            const { fn, options, message } = validator || {}
            const validationResult = fn(value, options)

            if (!validationResult) {
              errors.push({
                field,
                message,
                type: 'ValidationError'
              })
            }
          }
        }
      }
    }

    if (hasQuery) {
      const entries = Object.entries(query)

      for (const [field, value] of entries) {
        if (Reflect.has(scheme, field)) {
          const { fields = ['body'], validators = [] } = scheme[field]
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
                message,
                type: 'ValidationError'
              })
            }
          }
        }
      }
    }

    if (hasBody || method === 'POST' || method === 'PUT') {
      const entries = Object.entries(body)

      const lostRequiredFields = Object.entries(scheme).reduce((reqFields, [field, value]) => {
        if (value.required && !Reflect.has(body, field)) {
          reqFields.push(field)
        }

        return reqFields
      }, [])

      if (lostRequiredFields.length && method === 'POST') {
        for (const field of lostRequiredFields) {
          errors.push({
            field,
            message: `Field ${field} is required!`,
            type: 'ValidationError'
          })
        }
      } else {
        for (const [field, value] of entries) {
          if (Reflect.has(scheme, field)) {
            const { validators = [], enum: signification } = scheme[field]

            if (method === 'POST') {
              if (signification && signification.length) {
                if (!signification.includes(value)) {
                  errors.push({
                    field,
                    message: `Field ${field} should be one of "${signification.join(', ')}"`,
                    type: 'ValidationError'
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
                  message,
                  type: 'ValidationError'
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
          message: e.message,
          type: e.name
        }
      ]
    }
  }
}

module.exports = validator
