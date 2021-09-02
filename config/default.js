require('dotenv').config()
const logger = require('./logger')

module.exports = {
  server: {
    port: 5000,
    secret: process.env.SECRET_KEY,
    tokenExp: 180,
    refreshTokenExp: 300
  },
  db: {
    url: process.env.DB_URL,
    name: 'test'
  },
  cache:{
    host: '127.0.0.1',
    port: '6379'
  },
  logger: logger.default
}
