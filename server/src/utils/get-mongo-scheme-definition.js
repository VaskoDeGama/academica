'use strict'

/**
 * @param {object} scheme
 * @returns {object}
 */
function getMongoSchemeDefinition (scheme = {}) {
  const mongoSchemeDefinition = {}

  const entries = Object.entries(scheme)

  for (const [field, definition] of entries) {
    if (field === 'id') {
      continue
    }
    mongoSchemeDefinition[field] = definition
  }

  return mongoSchemeDefinition
}

module.exports = getMongoSchemeDefinition
