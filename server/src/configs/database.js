'use strict'
const mongoose = require('mongoose')
const { servLog } = require('../utils/logger')

/**
 * @typedef {object} DB
 * @property {Function} getConnection - return mongoose
 * @property {Function} connect - connect to db
 * @property {Function} close - close connection
 */

class Database {
  /**
   * @param {object} config
   */
  constructor (config) {
    this.options = {
      dbName: config.name,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }

    this.url = config.url

    mongoose.connection.on('error', (err) => {
      servLog.error(`Error! DB Connection failed. Error: ${err}`)
      return err
    })

    mongoose.connection.once('connected', () => {
      servLog.info('Connection to MongoDB established')
    })

    mongoose.connection.on('disconnected', () => {
      servLog.info('Connection to MongoDB closed')
    })
  }

  /**
   * @returns {Mongoose}
   */
  getConnection () {
    return mongoose.connection
  }

  /**
   * @returns {Mongoose}
   */
  connect () {
    return mongoose.connect(this.url, this.options)
  }

  /**
   * @param {boolean} force
   * @returns {Promise<void>}
   */
  close (force) {
    return mongoose.connection.close(force)
  }

  /**
   * @returns {string}
   */
  static ping () {
    return mongoose.STATES[mongoose.connection.readyState]
  }
}

module.exports = Database
