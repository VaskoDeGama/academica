'use strict'

/**
 * @classdesc BaseController
 * @name BaseController
 * @property {Function} jsonResponse {@link jsonResponse}
 * @class
 */
class BaseController {
  /**
   * @param {BaseService} service
   */
  constructor (service) {
    this._service = service
  }

  async getAll (req, res) {
    await this._service.createOne({
      username: 'kek',
      password: 'jopa'
    })
    const data = await this._service.getAll()
    return this.ok(res, data)
  }

  /**
   * @function
   * @param {Response} res
   * @param {number} code
   * @param {string} message
   * @returns {Response}
   */
  static jsonResponse (res, code, message) {
    return res.status(code).json({ message })
  }

  /**
   * @param {Response} res
   * @param {object} dto
   * @returns {Response}
   */
  ok (res, dto) {
    if (dto) {
      return res.status(200).json(dto)
    } else {
      return res.status(200)
    }
  }

  /**
   * @param {Response} res
   * @returns {Response}
   */
  created (res) {
    return res.status(201)
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  clientError (res, message) {
    return BaseController.jsonResponse(res, 400, message || 'Unauthorized')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  unauthorized (res, message) {
    return BaseController.jsonResponse(res, 401, message || 'Unauthorized')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  paymentRequired (res, message) {
    return BaseController.jsonResponse(res, 402, message || 'Payment required')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  forbidden (res, message) {
    return BaseController.jsonResponse(res, 403, message || 'Forbidden')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  notFound (res, message) {
    return BaseController.jsonResponse(res, 404, message || 'Not found')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  conflict (res, message) {
    return BaseController.jsonResponse(res, 409, message || 'Conflict')
  }

  /**
   * @param {Response} res
   * @param  {string} message
   * @returns {Response}
   */
  tooMany (res, message) {
    return BaseController.jsonResponse(res, 429, message || 'Too many requests')
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param  {Error|string} error
   * @returns {Request}
   */
  fail (req, res, error) {
    req.app.servLog.error(error)
    const status = error.httpCode || error.status || 500
    return res.status(status).json({ success: false, status, error: error.message || error })
  }
}

module.exports = BaseController
