require('dotenv').config()
const logger = require('./logger')

module.exports = {
  Server: {
    port: 3001,
    secret: process.env.SECRET_KEY
  },
  DataBase: {
    url: process.env.DB_URL
  },
  Logger: logger
}
