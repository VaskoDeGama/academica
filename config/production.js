require('dotenv').config()
const logger = require('./logger')

module.exports = {
  server: {
    port: 1488,
    secret: process.env.SECRET_KEY,
    tokenExp: 60 * 60,
    refreshTokenExp: 24 * 60 * 60 * 1000
  },
  db: {
    url: process.env.DB_URL,
    name: 'prodBase'
  },
  cache:{
    host: '127.0.0.1',
    port: '6379'
  },
  logger: logger.production

}
