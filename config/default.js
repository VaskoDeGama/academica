require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 5000,
    secret: process.env.SECRET_KEY
  },
  DataBase: {
    url: process.env.DB_URL
  },
  Logger: logger
}
