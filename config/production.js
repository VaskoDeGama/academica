// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  Server: {
    port: 1488,
    secret: process.env.SECRET_KEY
  }
}
