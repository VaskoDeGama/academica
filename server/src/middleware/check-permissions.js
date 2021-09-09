'use strict'

const { BaseController } = require('../controllers')

/**
 * check owner
 *
 * @param {string} resource
 * @param {string} action
 * @returns {Function}
 */
function checkPermissions (resource, action) {
  return async (req, res, next) => {
    const { permissions } = req.user || {}

    const resourceRights = permissions.find(p => p.resource === resource)

    if (!resourceRights) {
      BaseController.setResponse({ req, res, code: 403 })
      return res.end()
    }

    if (!resourceRights[action]) {
      BaseController.setResponse({ req, res, code: 403 })
      return res.end()
    }

    if (resourceRights.onlyOwned) {
      req.user.onlyOwned = true
    }

    if (resourceRights.mutableFields.length) {
      req.user.mutableFields = resourceRights.mutableFields
    }

    next()
  }
}

module.exports = checkPermissions
