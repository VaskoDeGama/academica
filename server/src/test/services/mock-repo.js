'use strict'
const delay = require('../../utils/delay')
const { mongo } = require('mongoose')

class MockRepo {
  constructor (mockData, mockSchema) {
    this.db = mockData
    this.schema = mockSchema
  }

  /**
   * Get all from collection
   *
   * @returns {Promise<object[]>}
   */
  async getAllUsers () {
    return new Promise((resolve, reject) => {
      delay(10).then(() => resolve(this.db))
    })
  }

  /**
   * Get one by id
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findUserById (id) {
    return new Promise((resolve, reject) => {
      delay(10).then(() => resolve(this.db.find(r => r.id === id) || null))
    })
  }

  /**
   * Save one to db
   *
   * @param {object} doc
   * @returns {Promise<object>}
   */
  async saveUser (doc) {
    return new Promise((resolve, reject) => {
      delay(10).then(() => {
        Object.keys(this.schema).forEach(key => {
          if (this.schema[key].required && !Reflect.has(doc, key)) {
            const error = new Error(`validation failed: ${key}: Path \`${key}\` is required.`)
            error.name = 'ValidationError'
            reject(error)
          }

          if (this.schema[key].unique && Reflect.has(doc, key)) {
            if (this.db.find(r => doc[key] === r[key])) {
              const error = new Error(`Duplicate ${key} field`)
              error.code = 11000
              error.keyValue = {}
              error.keyValue[key] = doc[key]
              reject(error)
            }
          }

          if (!Reflect.has(doc, key) && Reflect.has(this.schema[key], 'default')) {
            doc[key] = this.schema[key].default
          }
        })
        if (!Reflect.has(doc, 'id')) {
          doc.id = new mongo.ObjectId().toString()
        }

        if (doc.id instanceof mongo.ObjectId) {
          doc.id = doc.id.toString()
        }

        this.db.push(doc)

        resolve(this.db.find(r => doc.id === r.id) || null)
      })
    })
  }

  /**
   * Get many by ids
   *
   * @param {string[]} ids
   * @returns {Promise<object[]>}
   */
  async findUsersByIds (ids) {
    return new Promise((resolve, reject) => {
      delay(10).then(() => {
        resolve(this.db.filter(r => ids.includes(r.id)))
      })
    })
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object[]>}
   */
  async findUsersByQuery (query) {
    return new Promise((resolve, reject) => {
      delay(10).then(() => {
        resolve(this.db.filter(r => {
          return Object.keys(query).every(key => r[key] === query[key])
        }))
      })
    })
  }

  /**
   * Get many by query
   *
   * @param {string} id
   * @returns {Promise<object>}
   */
  async removeUserById (id) {
    return new Promise((resolve, reject) => {
      delay(10).then(() => {
        const index = this.db.findIndex(r => r.id === id)
        const result = {
          deletedCount: 0
        }
        if (index !== -1) {
          result.deletedCount += this.db.splice(index, 1).length
        }
        resolve(result)
      })
    })
  }

  /**
   * Get many by query
   *
   * @param {string[]} ids
   * @returns {Promise<object>}
   */
  async removeUsersByIds (ids) {
    return new Promise((resolve) => {
      delay(10).then(() => {
        const usersForDelete = this.db.filter(r => ids.includes(r.id))
        const result = {
          deletedCount: 0
        }

        for (const user of usersForDelete) {
          const index = this.db.findIndex(r => r.id === user.id)

          if (index !== -1) {
            result.deletedCount += this.db.splice(index, 1).length
          }
        }

        resolve(result)
      })
    })
  }

  /**
   * Get many by query
   *
   * @param {object} query
   * @returns {Promise<object>}
   */
  async removeUsersByQuery (query) {
    return new Promise((resolve) => {
      delay(10).then(() => {
        const usersForDelete = this.db.filter(r => {
          return Object.keys(query).every(key => r[key] === query[key])
        })
        const result = {
          deletedCount: 0
        }

        for (const user of usersForDelete) {
          const index = this.db.findIndex(r => r.id === user.id)

          if (index !== -1) {
            result.deletedCount += this.db.splice(index, 1).length
          }
        }

        resolve(result)
      })
    })
  }

  /**
   *
   * @param {string} id
   * @param {object} update
   * @returns {Promise<object>} - updated record
   */
  async findUserAndUpdate (id, update) {
    return new Promise((resolve) => {
      delay(10).then(() => {
        const usersForUpdate = this.db.findIndex(r => r.id === id)

        if (usersForUpdate === -1) {
          resolve(null)
        } else {
          this.db[usersForUpdate] = Object.assign(this.db[usersForUpdate], update)

          resolve(this.db[usersForUpdate])
        }
      })
    })
  }
}

module.exports = MockRepo
