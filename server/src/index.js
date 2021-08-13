'use strict'

const ExpressServer = require('./configs/express-server')

const app = new ExpressServer()

const main = async () => {
  try {
    await app.start()
  } catch {
    process.exit(1)
  }
}

main().then()
