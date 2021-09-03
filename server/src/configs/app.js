'use strict'

const { ioc } = require('../ioc')
const { Types } = require('../models')

class App {
  constructor () {
    this.db = ioc.get(Types.db)
    this.server = ioc.get(Types.server)
    this.cache = ioc.get(Types.cache)
  }

  /**
   *
   * @param {object} config
   * @returns {Promise<void>}
   */
  async start (config) {
    try {
      await this.db.connect(config.db)
      await this.cache.connect(config.cache)
      await this.server.start(config.server)
    } catch (error) {
      console.log(error)
      await this.stop()
    }
  }

  async stop () {
    await this.db.close()
    await this.cache.close()
    await this.server.stop()
  }
}

module.exports = App
