require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 5000,
    secret: process.env.SECRET_KEY,
    secretRefresh: process.env.REFRESH_SECRET_KEY,
    tokenExp: 20,
    refreshTokenExp: 86400
  },
  DataBase: {
    url: process.env.DB_URL,
    dbName: 'test'
  },
  Logger: logger.default
}
