'use strict'
const mongoose = require('mongoose')
const { User } = require('../models')
const { mockUsers } = require('../test/models/mock-data')

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
      useUnifiedTopology: true
    }

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
   * @returns {mongoose}
   */
  async connect (config) {
    this.options.dbName = config.name
    try {
      await mongoose.connect(config.url, this.options)
    } catch (e) {
      this.log.error(`Error! DB Connection failed. Error: ${e}`)
      return false
    }

    this.db = this.mongoose.connection.db

    /* istanbul ignore next */
    if (process.env.SEEDING) {
      this.log.info('Start seed db...')
      await this.dropCollections(['users', 'tokens'])
      await User.create(mockUsers)
      this.log.info('Seed db succeed!')
    }
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
