'use strict'

const { BaseController } = require('../controllers')

/**
 * check owner
 *
 * @param {string[]} who
 * @param {string} [field='id']
 * @param {string} [place='params']
 * @param {string} [model]
 * @returns {Function}
 */
function checkPermissions (who, field = 'id', place = 'params', model) {
  if (typeof who === 'string') {
    who = [who]
  }

  return async (req, res, next) => {
    const { id: userId, role } = req.user || {}

    if (who.includes(role)) {
      if (!model && Reflect.has(req[place], field) && req[place][field] !== userId) {
        BaseController.setResponse({ req, res, code: 403 })
        return res.end()
      }
    }

    next()
  }
}

module.exports = checkPermissions
