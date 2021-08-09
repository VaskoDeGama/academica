import { config } from 'dotenv'
config()

export default {
  Server: {
    port: 5000,
    secret: process.env.SECRET_KEY
  }
}
