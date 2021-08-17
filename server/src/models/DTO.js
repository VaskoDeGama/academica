'use strict'
const httpContext = require('express-http-context')

/**
 * @typedef {object} DTOReq
 * @property {string} method - req method
 * @property {object} query - query params from req strong
 * @property {object} params - params like :id
 * @property {object} body - body if post or put
 */

/**
 * Data transfer object between levels within the system
 *
 * @class
 * @classdesc Data transfer object between levels within the system
 */
class DTO {
  /**
   * @param {Request} req
   */
  constructor (req) {
    this.reqId = httpContext.get('traceId')
    /** @type {boolean} - successful request or not */
    this._success = false
    /** @type {DTOReq} - simplify req object */
    this.request = {
      method: req.method,
      query: req.query,
      params: req.params,
      body: req.body
    }
    /** @type {any|null} data - query result */
    this._data = null
    /** @type {object[]} errors - query errors */
    this.errors = []
  }

  get success () {
    return this._success
  }

  set data (value) {
    this._data = value
    this._success = true
  }

  get data () {
    return this._data
  }

  /**
   *
   * @param {string|Error} error
   */
  addError (error) {
    if (typeof error === 'string') {
      this.errors.push({ msg: error, type: 'Custom' })
    }

    this.errors.push({ error, msg: error.message, type: error.name })
  }

  toJSON () {
    const result = {
      reqId: this.reqId,
      success: this.success
    }

    if (this.data) {
      result.data = this.data
    }

    if (this.errors.length) {
      result.errors = this.errors
    }

    return result
  }
}

module.exports = DTO
