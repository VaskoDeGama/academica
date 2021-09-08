'use strict'

class Cache {
  /**
   * @param {Logger} logger
   */
  constructor (logger) {
    this.redis = require('redis')
    /** @type {RedisClient} */
    this.client = null
    this.log = logger
  }

  /**
   * @param {object} config
   * @returns {Promise<this>}
   */
  async connect (config) {
    return new Promise((resolve, reject) => {
      this.client = this.redis.createClient(config)

      this.client.on('error', (error) => {
        this.log.error('Redis:', error.message)
        reject(error)
      })
      this.client.on('connect', () => {
        this.log.info('Connection to Redis established')
        resolve()
      })
    })
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<string>}
   */
  async get (key) {
    return new Promise((resolve, reject) => {
      if (this.client && this.client.connected) {
        this.client.get(key, (err, value) => {
          if (err) reject(err)
          resolve(value)
        })
      } else {
        reject(new Error('Connection failure'))
      }
    })
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} [seconds=0]
   * @returns {Promise<void>}
   */
  async set (key, value, seconds = 0) {
    return new Promise((resolve, reject) => {
      if (this.client && this.client.connected) {
        if (seconds > 0) {
          this.client.setex(key, seconds, value, (err) => {
            if (err) reject(err)
            resolve(true)
          })
        } else {
          this.client.set(key, value, (err) => {
            if (err) reject(err)
            resolve(true)
          })
        }
      } else {
        reject(new Error('Connection failure'))
      }
    })
  }

  /**
   * @returns {Promise<this>}
   */
  async close () {
    if (this.client) {
      return new Promise(resolve => {
        this.client.quit(() => {
          this.log.info('Redis connection stopped!')
          this.client = null
          resolve()
        })
      })
    }
  }
}

module.exports = Cache
