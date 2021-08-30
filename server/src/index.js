'use strict'
const config = require('config')
const App = require('./configs/app')
const signals = require('./utils/signals')
const app = new App(config)
const shutdown = signals.init(async () => await app.stop())

const main = async () => {
  try {
    await app.start()
  } catch {
    await shutdown()
  }
}

main().then()
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
