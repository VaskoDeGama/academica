'use strict'

/**
 * @typedef {object} ResultDTO
 * @property {boolean} success - query result
 * @property {string} reqId - query id
 * @property {number} status - http code
 * @property {any} [data] - result data
 * @property {object[]} [cookies] - query cookies
 * @property {object[]} [errors] - query errors
 */

const msgMap = {
  'jwt expired': 'Token expired!',
  'jwt malformed': 'Token required!'
}

/**
 * Data transfer object between levels within the system
 *
 * @class
 * @classdesc Data transfer object between levels within the system
 */
class ResultDto {
  /**
   * @param {RequestDTO} [reqDto]
   */
  constructor (reqDto) {
    /** @type {number} - http status code */
    this._status = 500
    /** @type {boolean} - successful request or not */
    this._success = false
    /** @type {any|null} data - query result */
    this._data = null
    /** @type {string} - req id */
    this.reqId = reqDto?.reqId || 'test'
    /** @type {object[]} errors - query errors */
    this._errors = []

    /** @type {object[]} query cookies */
    this.cookies = []
  }

  get errors () {
    return this._errors
  }

  set success (value) {
    this.status = 200
    this._success = value
  }

  set status (value) {
    this._status = value
  }

  set data (value) {
    this._data = value
    this.success = true
  }

  get success () {
    return this._success
  }

  get data () {
    return this._data
  }

  get status () {
    return this._status
  }

  /**
   * @param {string} name
   * @param {string} value
   * @param {object} options
   * @returns {ResultDTO}
   */
  addCookie (name, value, options = {}) {
    this.cookies.push({
      name,
      value,
      options
    })
    return this
  }

  /**
   *
   * @param {string|Error|Error[]} error
   * @param {number} [status=500]
   * @param {string} [type='Error']
   * @returns {ResultDTO}
   */
  addError (error, status, type = 'Error') {
    if (!Array.isArray(error)) {
      if (typeof error === 'string') {
        error = [{ message: error, status, type }]
      } else {
        error = [error]
      }
    }

    for (const err of error) {
      this.status = typeof err.code === 'number'
        ? err.code
        : err.status || 500

      const message = msgMap[err.message || err.msg] || err.message || err.msg

      this._errors.push({ error: !process.env.PRODUCTION ? err : undefined, message: message, type: err.name || err.type })
    }

    return this
  }

  /**
   *
   * @returns {ResultDTO}
   */
  toJSON () {
    const result = {
      reqId: this.reqId,
      success: this.success,
      status: this.status
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

module.exports = ResultDto
