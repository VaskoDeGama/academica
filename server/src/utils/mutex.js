'use strict'

class Mutex {
  /**
   * @param {object} [params]
   * @param {boolean} [params.debug=true]
   * @param {number} [params.busyWarnInterval=60000]
   * @param {string} [params.name]
   * @param {number} [params.safetyCatch=30 * 60 * 60 * 1000]
   */
  constructor ({
    debug = true,
    busyWarnInterval = 60000,
    name = '',
    safetyCatch = 30 * 60 * 60 * 1000
  }) {
    /** @type {boolean} */
    this.busy = false

    /** @type {number} */
    this.lastId = 1

    /** @type {string} */
    this.lockedBy = ''

    /** @type {number} */
    this.lockTime = 0

    /** @type {{timeoutId: NodeJS.Timeout, resolve: Function, lockedBy: string}[]} */
    this.queue = []

    /** @type {boolean} */
    this.debug = debug

    /** @type {?NodeJS.Timeout} */
    this.busyWarnIntervalId = null

    /** @type {number} */
    this.busyWarnInterval = busyWarnInterval

    /** @type {string} */
    this.name = name

    /** @type {number} */
    this.safetyCatch = safetyCatch
  }

  /**
   * @param {string} [lockedBy='']
   * @returns {number} - 0: failed
   */
  set (lockedBy = '') {
    if (!this.busy) {
      if (++this.lastId >= Number.MAX_SAFE_INTEGER) {
        this.lastId = 1
      }

      this.busy = true
      this.lockedBy = lockedBy
      this.lockTime = Date.now()

      if (this.debug) {
        this.busyWarnIntervalId = setInterval(() => {
          const lockedFor = Math.floor((Date.now() - this.lockTime) / 1000)

          if (this.safetyCatch > 0 && lockedFor > (this.safetyCatch / 1000)) {
            this.clear(this.lastId)
            console.error(`Mutex ${this.name}:${this.lastId} is locked by '${this.lockedBy}' safety catch was triggered after ${lockedFor}s`)
          } else {
            console.error(`Mutex ${this.name}:${this.lastId} is locked by '${this.lockedBy}' for ${lockedFor}s`)
          }
        }, this.busyWarnInterval)
      }

      return this.lastId
    }

    return 0
  }

  /**
   * @param {number} id
   */
  clear (id) {
    if (this.lastId === id) {
      this.busy = false
      this.lockedBy = ''
      this.lockTime = 0

      if (this.busyWarnIntervalId) {
        clearInterval(this.busyWarnIntervalId)
        this.busyWarnIntervalId = null
      }

      const next = this.queue.shift()

      if (next) {
        const nextId = this.set(next.lockedBy)

        setImmediate(() => next.resolve(nextId))
      }
    } else if (this.debug) {
      console.trace(`Bad Mutex.clear(). name: ${this.name} id: ${id}, last id: ${this.lastId}. Locked by ${this.lockedBy}`)
    }
  }

  /**
   * @param {number} timeout - [0...60000]
   * @param {string} [lockedBy='']
   * @returns {Promise<number>}
   */
  async wait (timeout, lockedBy = '') {
    if (!(timeout >= 0 && timeout <= 60000)) {
      if (this.debug) {
        console.trace(`Bad mutex wait timeout ${timeout}`)
      }

      return 0
    }

    return new Promise(resolve => {
      if (!this.busy) {
        const lastId = this.set(lockedBy)

        resolve(lastId)
      } else {
        const rec = /** @type {{timeoutId: NodeJS.Timeout, resolve: Function, lockedBy: string}} */ {
          lockedBy,
          timeoutId: setTimeout(() => {
            const idx = this.queue.findIndex(rec2 => rec2 === rec)

            if (idx !== -1) {
              this.queue.splice(idx, 1)
            }

            rec.resolve(0)
          }, timeout),

          resolve: lockId => {
            clearTimeout(rec.timeoutId)
            resolve(lockId)
          }
        }

        this.queue.push(rec)
      }
    })
  }
}

module.exports = Mutex
