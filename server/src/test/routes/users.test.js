const supertest = require('supertest')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { Role, User } = require('../../models')

const { mockUsers, roles } = require('../models/mock-data')
const App = require('../../configs/app')

describe('User routes', () => {
  let mongoServer = null
  let server = null
  let address = null
  let request = null
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: config.db.ip,
        port: config.db.port
      }
    })
    server = new App()

    await server.start(config)
    address = `http://localhost:${config.get('server').port}`
    request = supertest(address)
    await Role.create(roles)
  })

  beforeEach(async () => {
    await server.db.dropCollections(['users'])
    await User.create(mockUsers)
  })

  afterAll(async () => {
    await server.stop()
    await mongoServer.stop()
  })

  it('ping', async () => {
    const { body } = await request.get('/').expect(200).expect('Content-Type', /json/)

    expect(body.success).toBeTruthy()
    expect(body.data.isOnline).toBeTruthy()
    expect(body.data.timing).toBeLessThan(10)
    expect(body.data.dbStatus).toBe('connected')
  })
})
