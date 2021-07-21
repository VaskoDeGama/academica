'use strict'

/*
const logger = new Logger({
  patchConsole: true,
  logToConsole: ['error'],
  consolePrefix: () => `[${new Date(Date.now() + 180 * 60000).toISOString().replace('T', ' ').replace('Z', '')}][System]`
})
or
const logger = new Logger({
  patchConsole: true,
  logToConsole: true,
  consolePrefix: Logger.logPrefix
})
*/

/**
 * @typedef {Class} Logger
 */
class Logger {
  /**
   *
   * @param {object} options
   * @param {Function} [options.consolePrefix=null]
   * @param {boolean} [options.patchConsole=false]
   * @param {boolean|string[]} [options.logToConsole=false]
   */
  constructor ({
    consolePrefix = null,
    patchConsole = false,
    logToConsole = true
  }) {
    this.consolePrefix = typeof consolePrefix === 'function' ? consolePrefix : null
    this.logToConsole = Array.isArray(logToConsole)
      ? new Set(/** @type {string[]} */ logToConsole)
      : typeof logToConsole === 'boolean' && logToConsole
        ? new Set(['log', 'info', 'warn', 'error', 'debug'])
        : new Set([])

    this.origConsoleMethods = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: (console.debug || console.log).bind(console)
    }

    if (patchConsole) {
      this.patchConsole(this.consolePrefix)
    }
  }

  /**
   * @param {string} level - 'error', 'warn', 'info', 'debug'
   * @param {string} msg - message
   * @param {any} [data] - some data for log without toString
   */
  log (level, msg, data) {
    if (this.logToConsole.has(level)) {
      const method = (this.origConsoleMethods[level] || this.origConsoleMethods.log)

      const args = []

      if (this.consolePrefix) {
        args.push(this.consolePrefix())
      }

      args.push(msg)

      if (typeof data !== 'undefined') {
        args.push(data)
      }

      method(...args)
    }
  }

  /**
   * logPrefix
   * @returns {string}
   */
  static logPrefix () {
    return `[${new Date(Date.now() + 180 * 60000).toISOString().replace('T', ' ').replace('Z', '')}]${service}`
  }

  /**
   * @param {string} level - 'error', 'warn', 'info', 'debug'
   * @param {Function} consolePrefix
   * @returns {Function}
   */
  getHookHandler (level, consolePrefix) {
    const origMethod = this.origConsoleMethods[level]

    return consolePrefix
      ? (...args) => origMethod(consolePrefix(), ...args)
      : origMethod
  }

  setHook (level, consolePrefix) {
    console[level] = this.getHookHandler(level, consolePrefix)
  }

  /**
   * Hook console.log()/console.error() etc
   * @param {Function|null} [consolePrefix=null] - first arg of console.log()
   */
  patchConsole (consolePrefix = null) {
    this.setHook('log', consolePrefix)
    this.setHook('info', consolePrefix)
    this.setHook('warn', consolePrefix)
    this.setHook('error', consolePrefix)
    this.setHook('debug', consolePrefix)
  }

  /**
   * error
   * @param {string} msg
   * @param {object} data
   */
  error (msg, data) {
    this.log('error', msg, data)
  }

  /**
   * warn
   * @param {string} msg
   * @param {object} data
   */
  warn (msg, data) {
    this.log('warn', msg, data)
  }

  /**
   * info
   * @param {string} msg
   * @param {object} data
   */
  info (msg, data) {
    this.log('info', msg, data)
  }

  /**
   * debug
   * @param {string} msg
   * @param {object} data
   */
  debug (msg, data) {
    this.log('debug', msg, data)
  }
}

module.exports = Logger
