require('dotenv').config()
const logger = require('./logger')

module.exports = {
  server: {
    port: 5445,
    secret: process.env.SECRET_KEY,
    tokenExp: 10 * 60, // in seconds
    refreshTokenExp: 30 * 60 * 1000 // on ms
  },
  db: {
    url: 'mongodb://127.0.0.1:27017/',
    name: 'test'
  },
  cache:{
    host: '127.0.0.1',
    port: '6379'
  },
  logger: logger.default
}
