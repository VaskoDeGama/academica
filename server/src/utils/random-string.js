const crypto = require('crypto')

/**
 * get random hex string
 *
 * @param {number} size
 * @returns {string}
 */
function randomString (size = 40) {
  return crypto.randomBytes(size).toString('hex')
}

module.exports = randomString
