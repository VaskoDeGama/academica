'use strict'

const httpContext = require('express-http-context')
const isEmpty = require('./../utils/is-empty')

/**
 * @typedef {object} RequestDTO
 * @property {string} method - req method
 * @property {string} reqId - req reqId
 * @property {object} query - query params from req strong
 * @property {object} params - params like :id
 * @property {object} body - body if post or put
 * @property {boolean} hasQuery - true if query not empty
 * @property {boolean} hasParams - true if params not empty
 * @property {boolean} hasBody - true if body not empty
 * @property {string} ipAddress - req ip
 * @property {object} cookies - req ip
 * @property {object} user - req user
 * @property {DiContainer} ioc - req ioc
 */

/**
 * Data transfer object between levels within the system
 *
 * @class
 * @classdesc Data transfer object between levels within the system
 */
class RequestDto {
  /**
   * @param {Request} req
   */
  constructor (req) {
    /** @type {string} - req id */
    this.reqId = httpContext.get('traceId') || 'test'
    /** @type {boolean} - req has query? */
    this.hasQuery = !isEmpty(req.query)
    /** @type {boolean} - req has params? */
    this.hasParams = !isEmpty(req.params)
    /** @type {boolean} - req has body? */
    this.hasBody = !isEmpty(req.body)
    /** @type {string} - req method */
    this.method = req.method
    /** @type {object} - req query */
    this.query = req.query
    /** @type {object} - req params */
    this.params = req.params
    /** @type {object} - req body */
    this.body = req.body
    /** @type {string} - req ip */
    this.ipAddress = req.ip || '127.0.0.1'
    /** @type {object} - req cookies */
    this.cookies = req.cookies || {}
    /** @type {object} - req user */
    this.user = req.user || {}
    /** @type {DiContainer} */
    this.ioc = req.app.get('ioc')
  }
}

module.exports = RequestDto
