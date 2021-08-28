const mongoose = require('mongoose')
const config = require('config')

const { refreshTokenExp } = config.get('server')

const randomString = require('../../utils/random-string')
const { mockUsers } = require('./mock-users')
const mockTokens = []
const mockTokensLength = 10

for (let i = 0; i < mockTokensLength; i += 1) {
  const { _id } = mockUsers[i % 2 === 0 ? 0 : 1]

  mockTokens.push({
    _id: new mongoose.Types.ObjectId(),
    token: randomString(),
    createdByIp: `127.0.0.${i}`,
    expires: new Date([1, 4, 5].includes(i) ? Date.now() - refreshTokenExp : Date.now() + refreshTokenExp),
    user: _id
  })
}

module.exports = {
  mockTokens,
  mockTokensLength
}
