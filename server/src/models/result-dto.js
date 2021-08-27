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

/**
 * Data transfer object between levels within the system
 *
 * @class
 * @classdesc Data transfer object between levels within the system
 */
class ResultDto {
  /**
   * @param {RequestDTO} [reqDto]
   * @param {ValidationError[]} errors
   */
  constructor (reqDto, errors) {
    /** @type {number} - http status code */
    this._status = 500
    /** @type {boolean} - successful request or not */
    this._success = false
    /** @type {any|null} data - query result */
    this._data = null
    /** @type {string} - req id */
    this.reqId = reqDto?.reqId || 'test'
    /** @type {object[]} errors - query errors */
    this.errors = errors || []

    if (errors?.length) {
      this.status = 400
    }

    /** @type {object[]} query cookies */
    this.cookies = []
  }

  set success (value) {
    if (value) {
      this.status = 200
    }
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
   * @param {string|Error} error
   * @param {number} [status=400]
   * @returns {ResultDTO}
   */
  addError (error, status = 500) {
    this.status = status
    if (typeof error === 'string') {
      this.errors.push({ message: error, type: 'Custom' })
    } else {
      this.errors.push({ error, message: error.message, type: error.name })
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
