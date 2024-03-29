'use strict'

const { Router } = require('express')

/**
 * @typedef {object} Route
 * @property {string} path - url
 * @property {string} method - ['GET', 'POST', 'PUT', 'DELETE']
 * @property {Function} handler - ['GET', 'POST', 'PUT', 'DELETE']
 * @property {Function[]} localMiddleware - [fn]
 */

/**
 * @typedef {object} Controller
 * @property {Function} create - create req handler
 * @property {Function} get - get req handler
 * @property {Function} update - update req handler
 * @property {Function} delete - delete req handler
 */

class BaseController {
  constructor () {
    this.router = Router()
    /** @type {Route} */
    this.routes = []
  }

  setRoutes () {
    for (const route of this.routes) {
      const handler = route.handler.bind(this)
      switch (route.method) {
        case 'GET':
          this.router.get(route.path, route.localMiddleware, handler)
          break
        case 'POST':
          this.router.post(route.path, route.localMiddleware, handler)
          break
        case 'PUT':
          this.router.put(route.path, route.localMiddleware, handler)
          break
        case 'DELETE':
          this.router.delete(route.path, route.localMiddleware, handler)
          break
        default:
          throw new Error(`Not registered method! ${route.method}`)
      }
    }
  }

  /**
   * @param {object} params
   */
  setResp (params) {
    BaseController.setResponse(params)
  }

  /**
   *
   * @param {object} o
   * @param {Request} o.req
   * @param {Response} o.res
   * @param {ResultDTO} o.resultDTO
   * @param {number} o.code
   * @param {string} o.message
   * @returns {Response}
   */
  static setResponse ({ req, res, resultDTO, code, message }) {
    if (resultDTO) {
      return resultDTO.success
        ? BaseController.ok(res, resultDTO)
        : BaseController.fail({ req, res, dto: resultDTO })
    }

    switch (code) {
      case 200: return BaseController.ok(res)
      case 201: return BaseController.created(res)
      case 400: return BaseController.clientError(res, null, message)
      case 401: return BaseController.unauthorized(res, null, message)
      case 402: return BaseController.paymentRequired(res, null, message)
      case 403: return BaseController.forbidden(res, null, message)
      case 404: return BaseController.notFound(res, null, message)
      case 409: return BaseController.conflict(res, null, message)
      case 429: return BaseController.tooMany(res, null, message)
      default: return BaseController.fail({ req, res, code, message })
    }
  }

  /**
   * @static
   * @param {object} o
   * @param {Response} o.res
   * @param {number} o.code
   * @param {string} o.message
   * @param {ResultDTO} o.dto
   * @returns {Response}
   */
  static jsonResponse ({ res, dto, code, message }) {
    if (dto) {
      if (Array.isArray(dto.cookies)) {
        for (const { name, value, options } of dto.cookies) {
          res.cookie(name, value, options)
        }
      }

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
   * @param {ResultDTO} [dto]
   * @returns {Response}
   */
  static ok (res, dto) {
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
  static created (res) {
    return BaseController.jsonResponse({ res, code: 201 })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Unauthorized']
   * @returns {Response}
   */
  static clientError (res, dto, message = 'Bad Request') {
    return BaseController.jsonResponse({ res, dto, code: 400, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Unauthorized']
   * @returns {Response}
   */
  static unauthorized (res, dto, message = 'Unauthorized') {
    return BaseController.jsonResponse({ res, dto, code: 401, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Payment required']
   * @returns {Response}
   */
  static paymentRequired (res, dto, message = 'Payment required') {
    return BaseController.jsonResponse({ res, dto, code: 402, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Forbidden']
   * @returns {Response}
   */
  static forbidden (res, dto, message = 'Forbidden') {
    return BaseController.jsonResponse({ res, dto, code: 403, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Not found'']
   * @returns {Response}
   */
  static notFound (res, dto, message = 'Not found') {
    return BaseController.jsonResponse({ res, dto, code: 404, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Conflict']
   * @returns {Response}
   */
  static conflict (res, dto, message = 'Conflict') {
    return BaseController.jsonResponse({ res, dto, code: 409, message })
  }

  /**
   * @param {Response} res
   * @param {ResultDTO} [dto]
   * @param  {string} [message='Too many requests']
   * @returns {Response}
   */
  static tooMany (res, dto, message = 'Too many requests') {
    return BaseController.jsonResponse({ res, dto, code: 429, message })
  }

  /**
   * @param {param} o
   * @param {Request} o.req
   * @param {Response} o.res
   * @param {ResultDTO} [o.dto]
   * @param {number} [o.code=500]
   * @param {string} [o.message='Bad request']
   * @returns {Request}
   */
  static fail ({ req, res, dto, code = 500, message = 'Internal Server Error' }) {
    return BaseController.jsonResponse({ res, dto, code, message })
  }
}

module.exports = BaseController
