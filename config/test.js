// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  Server: {
    port: 3001,
    secret: process.env.SECRET_KEY
  }
}
