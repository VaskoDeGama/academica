require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 1488,
    secret: process.env.SECRET_KEY,
    secretRefresh: process.env.REFRESH_SECRET_KEY,
    tokenExp: 900,
    refreshTokenExp: 86400
  },
  DataBase: {
    url: process.env.DB_URL,
    dbName: 'prodBase'
  },
  Logger: logger.production

}
