'use strict'
const mongoose = require('mongoose')

/**
 *
 * @param {string} connString
 * @param {string} dbName
 * @returns {Promise<Error|Mongoose>}
 */
async function getDatabaseClient (connString, dbName) {
  return new Promise((resolve, reject) => {
    mongoose.connect(connString, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }, error => {
      reject(error)
    })
    mongoose.connection.once('connected', () => resolve(mongoose))
  })
}

module.exports = getDatabaseClient
