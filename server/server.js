'use strict'

const http = require('http')
const createResponseMessage = require('./utils/response-message')

class Server {
  constructor () {
    this._middleware = []
  }

  /**
   * @param {Function} fn
   */
  use (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be function')
    }

    this._middleware.push(fn)
  }

  /**
   *
   * @param {ClientRequest} req
   * @param {ServerResponse}res
   * @param {Function} out
   */
  handle (req, res, out) {
    let idx = 0

    const next = (err) => {
      if (err != null) {
        return setImmediate(() => out(err))
      }

      if (idx >= this._middleware.length) {
        return setImmediate(() => out())
      }

      const layer = this._middleware[idx++]

      setImmediate(() => {
        try {
          layer(req, res, next)
        } catch (error) {
          next(error)
        }
      })
    }

    next()
  }

  /**
   *
   * @param {ServerResponse} res
   * @param {number} [code=500]
   * @param {object}  [message={}]
   */
  send (res, code = 500, message = {}) {
    const msg = createResponseMessage(message)

    res.statusCode = code
    res.setHeader('Conent-Type', 'application/json')
    res.end(JSON.stringify(msg))
  }

  listen (port, callback) {
    const handler = (req, res) => {
      this.handle(req, res, err => {
        if (err) {
          this.send(res, 500, { error: err.message })
        }
      })
    }

    return http.createServer(handler).listen({ port }, callback)
  }
}

module.exports = Server
