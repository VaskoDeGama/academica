'use strict'
/**
 * @typedef {object} ResponseMessage
 * @property {string|null|object} error
 * @property {string|null|object} data
 * @property {boolean} success
 */

/**
 * @param {object} params
 * @param {boolean}[params.success=false]
 * @param {string|null|object} [params.error=null]
 * @param {string|null|object} [params.data=null]
 * @returns {ResponseMessage}
 */
const createResponseMessage = ({ success = false, error = null, data = null }) => {
  return {
    success,
    error,
    data
  }
}

module.exports = createResponseMessage
