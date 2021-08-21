'use strict'

/**
 * @typedef {object} ResultDTO
 * @property {boolean} success - query result
 * @property {string} reqId - query id
 * @property {number} status - http code
 * @property {any} [data] - result data
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
    this.errors = []
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
   *
   * @param {string|Error} error
   * @param {number} [status=400]
   */
  addError (error, status = 500) {
    this.status = status
    if (typeof error === 'string') {
      this.errors.push({ msg: error, type: 'Custom' })
    } else {
      this.errors.push({ error, msg: error.message, type: error.name })
    }
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
