require('dotenv').config()
const logger = require('./logger')

module.exports = {
  server: {
    port: 3001,
    secret: process.env.SECRET_KEY,
    tokenExp: 30,
    refreshTokenExp: 3 * 60 * 1000
  },
  db: {
    url: 'mongodb://127.0.0.1:59983/',
    name: 'mockBase'
  },
  cache:{
    host: '127.0.0.1',
    port: '6379'
  },
  logger: logger.test
}
