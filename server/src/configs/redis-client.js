'use strict'

const { servLog } = require('../utils/logger')

class RedisClient {
  /**
   * @param {object} config
   * @param {string} config.host
   * @param {number} config.port
   */
  constructor (config) {
    this.config = config
    this.redis = require('redis')
    /** @type {RedisClient} */
    this.client = null
  }

  /**
   * @returns {Promise<this>}
   */
  async connect () {
    return new Promise((resolve, reject) => {
      this.client = this.redis.createClient(this.config)

      this.client.on('error', (error) => {
        servLog.error('Redis:', error.message)
        reject(error)
      })
      this.client.on('connect', () => {
        servLog.info('Redis connection open!')
        resolve(this)
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
    return new Promise((resolve) => {
      if (this.client) {
        this.client.quit(() => {
          servLog.info('Redis connection stopped!')
          resolve(this)
        })
      }
    })
  }
}

module.exports = RedisClient
