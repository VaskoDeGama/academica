'use strict'
const mongoose = require('mongoose')

/**
 * @typedef {object} DB
 * @property {Function} getConnection - return mongoose
 * @property {Function} connect - connect to db
 * @property {Function} close - close connection
 */

class Database {
  /**
   * @param {Logger} logger
   */
  constructor (logger) {
    this.mongoose = require('mongoose')
    this.log = logger
    this.db = null

    this.options = {
      dbName: 'Test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }

    this.mongoose.connection.on('error', (err) => {
      this.log.error(`Error! DB Connection failed. Error: ${err}`)
      return err
    })

    this.mongoose.connection.once('connected', () => {
      this.log.info('Connection to MongoDB established')
    })

    this.mongoose.connection.on('disconnected', () => {
      this.log.info('Connection to MongoDB closed')
    })
  }

  /**
   * @returns {Mongoose}
   */
  getConnection () {
    return this.db
  }

  /**
   * @param {object} config
   * @returns {Mongoose}
   */
  async connect (config) {
    this.options.dbName = config.name
    await mongoose.connect(config.url, this.options)
    this.db = this.mongoose.connection.db
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
