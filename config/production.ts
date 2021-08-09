import { config } from 'dotenv'
config()

export default {
  Server: {
    port: 1488,
    secret: process.env.SECRET_KEY
  }
}
