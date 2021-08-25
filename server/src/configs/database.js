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
    this.mongoose = require('mongoose')

    this.options = {
      dbName: config.name,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }

    this.db = null
    this.url = config.url

    this.mongoose.connection.on('error', (err) => {
      servLog.error(`Error! DB Connection failed. Error: ${err}`)
      return err
    })

    this.mongoose.connection.once('connected', () => {
      servLog.info('Connection to MongoDB established')
    })

    this.mongoose.connection.on('disconnected', () => {
      servLog.info('Connection to MongoDB closed')
    })
  }

  /**
   * @returns {Mongoose}
   */
  getConnection () {
    return this.db
  }

  /**
   * @returns {Mongoose}
   */
  async connect () {
    await mongoose.connect(this.url, this.options)
    this.db = this.mongoose.connection.db
    return this
  }

  /**
   * @param {boolean} force
   * @returns {Promise<void>}
   */
  close (force) {
    return mongoose.connection.close(force)
  }

  async dropCollections (list) {
    if (list.constructor.name !== 'Array') {
      list = [list]
    }

    const collections = (await this.db.listCollections().toArray()).map(collection => collection.name)

    for (let i = 0; i < list.length; i++) {
      if (collections.indexOf(list[i]) !== -1) {
        await this.db.dropCollection(list[i])
      }
    }
  }

  /**
   * @returns {string}
   */
  static ping () {
    return mongoose.STATES[mongoose.connection.readyState]
  }
}

module.exports = Database
