'use strict'

class BaseController {
  constructor (service) {
    this.service = service
  }

  /**
   * @static
   * @param {object} o
   * @param {Response} o.res
   * @param {number} o.code
   * @param {string} o.message
   * @param {DTO} o.dto
   * @returns {Response}
   */
  static jsonResponse ({ res, dto, code, message }) {
    if (dto) {
      res.status(dto.status).json(dto)
    } else if (message) {
      res.status(code).json({ message })
    } else {
      res.status(code)
    }
    return res
  }

  /**
   * @param {Response} res
   * @param {object} [dto]
   * @returns {Response}
   */
  ok (res, dto) {
    if (dto) {
      return BaseController.jsonResponse({ res, dto })
    } else {
      return BaseController.jsonResponse({ res, code: 200 })
    }
  }

  /**
   * @param {Response} res
   * @returns {Response}
   */
  created (res) {
    return BaseController.jsonResponse({ res, code: 201 })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Unauthorized']
   * @returns {Response}
   */
  clientError (res, dto, message = 'Unauthorized') {
    return BaseController.jsonResponse({ res, dto, code: 400, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Unauthorized']
   * @returns {Response}
   */
  unauthorized (res, dto, message = 'Unauthorized') {
    return BaseController.jsonResponse({ res, dto, code: 401, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Payment required']
   * @returns {Response}
   */
  paymentRequired (res, dto, message = 'Payment required') {
    return BaseController.jsonResponse({ res, dto, code: 403, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Forbidden']
   * @returns {Response}
   */
  forbidden (res, dto, message = 'Forbidden') {
    return BaseController.jsonResponse({ res, dto, code: 403, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Not found'']
   * @returns {Response}
   */
  notFound (res, dto, message = 'Not found') {
    return BaseController.jsonResponse({ res, dto, code: 404, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Conflict']
   * @returns {Response}
   */
  conflict (res, dto, message = 'Conflict') {
    return BaseController.jsonResponse({ res, dto, code: 409, message })
  }

  /**
   * @param {Response} res
   * @param {DTO} [dto]
   * @param  {string} [message='Too many requests']
   * @returns {Response}
   */
  tooMany (res, dto, message = 'Too many requests') {
    return BaseController.jsonResponse({ res, dto, code: 429, message })
  }

  /**
   * @param {param} o
   * @param {Request} o.req
   * @param {Response} o.res
   * @param {DTO} [o.dto]
   * @param {number} [o.code=500]
   * @param {string} [o.message='Bad request']
   * @returns {Request}
   */
  fail ({ req, res, dto, code = 500, message = 'Bad request' }) {
    if (dto.status === 500 || (!dto && code === 500)) {
      req.app.servLog.error(dto.toJSON() || message)
    }
    return BaseController.jsonResponse({ res, dto, code, message })
  }
}

module.exports = BaseController
