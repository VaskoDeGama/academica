'use strict'
/* istanbul ignore file */

const config = require('config')
const App = require('./infrastructure/app')
const signals = require('./utils/signals')
const app = new App(config)
const shutdown = signals.init(async () => await app.stop())

const main = async () => {
  try {
    await app.start(config)
  } catch {
    await shutdown()
  }
}

main().then()
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
