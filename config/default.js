// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  Server: {
    port: 5000,
    secret: process.env.SECRET_KEY
  }
}
