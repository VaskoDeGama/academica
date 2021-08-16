require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 3001,
    secret: process.env.SECRET_KEY,
    secretRefresh: process.env.REFRESH_SECRET_KEY,
    tokenExp: 900,
    refreshTokenExp: 86400
  },
  DataBase: {
    url: process.env.DB_URL,
    dbName: 'mockBase'
  },
  Logger: logger.test
}
