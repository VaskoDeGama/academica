const supertest = require('supertest')
const ExpressServer = require('../../infrastructure/server')
const config = require('config')

const logger = {
  error: jest.fn().mockImplementation((text) => text),
  info: jest.fn().mockImplementation((text) => text)
}

describe('Server', () => {
  let server = null
  beforeAll(async () => {
    server = new ExpressServer(logger)
    await server.start(config.server)
  })

  afterAll(async () => {
    await server.stop()
  })

  it('server defined', () => {
    expect(ExpressServer).toBeDefined()
  })

  it('port is 3001', () => {
    const { port } = server.server.address() || {}
    expect(port).toBe(3001)
  })

  it('ping', async () => {
    const response = await supertest(server.server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.data.isOnline).toBeTruthy()
    expect(response.body.data.timing).toBeLessThan(10)
    expect(response.body.data.dbStatus).toBe('disconnected')
    expect(response.body.data.cacheStatus).toBe('disconnected')
  })

  it('bad route', async () => {
    const response = await supertest(server.server)
      .get('/bad route ')
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.message).toBe('Route not found')
  })
})
