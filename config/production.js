require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 1488,
    secret: process.env.SECRET_KEY
  },
  DataBase: {
    url: process.env.DB_URL,
    dbName: 'prodBase'
  },
  Logger: logger.production

}
