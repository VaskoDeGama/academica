const supertest = require('supertest')
const ExpressServer = require('../../infrastructure/server')
const config = require('config')

const { appLogger } = require('../../utils/logger')
const getCookies = require('../../utils/get-cookies')

describe('Server', () => {
  let server = null
  beforeAll(async () => {
    server = new ExpressServer(appLogger)
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
  })

  it('bad route', async () => {
    const response = await supertest(server.server)
      .get('/bad route ')
      .expect(404)
      .expect('Content-Type', /json/)

    const cookies = getCookies(response)
    expect(response.body.message).toBe('Route not found')
    expect(cookies).toEqual({ })
  })
})
