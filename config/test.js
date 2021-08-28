require('dotenv').config()
const logger = require('./logger')

module.exports = {
  server: {
    port: 3001,
    secret: process.env.SECRET_KEY,
    tokenExp: 900,
    refreshTokenExp: 86400
  },
  db: {
    url: process.env.DB_URL,
    name: 'mockBase'
  },
  redis:{
    host: '127.0.0.1',
    port: '6379'
  },
  logger: logger.test
}
