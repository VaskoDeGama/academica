const mongoose = require('mongoose')
const config = require('config')
const crypto = require('crypto')

const { refreshTokenExp } = config.get('server')

const { mockUsers } = require('./mock-users')
const mockTokens = []
const mockTokensLength = 10

/**
 * get random hex string
 *
 * @returns {string}
 */
function randomTokenString () {
  return crypto.randomBytes(40).toString('hex')
}

for (let i = 0; i < mockTokensLength; i += 1) {
  const { _id } = mockUsers[i]
  mockTokens.push({
    _id: new mongoose.Types.ObjectId(),
    refreshToken: randomTokenString(),
    createdByIp: `127.0.0.${i}`,
    expires: new Date(Date.now() + refreshTokenExp),
    user: _id
  })
}

module.exports = {
  mockTokens,
  mockTokensLength
}
