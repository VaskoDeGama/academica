const supertest = require('supertest')
const ExpressServer = require('../../configs/server')
const config = require('config')

describe('ExpressServer', () => {
  let expressServer = null
  beforeAll(async () => {
    expressServer = new ExpressServer(config.server.port)
    await expressServer.start()
  })

  afterAll(async () => {
    await expressServer.close()
  })

  it('server defined', () => {
    expect(ExpressServer).toBeDefined()
  })

  it('port is 3001', () => {
    const { port } = expressServer.server.address() || {}
    expect(port).toBe(3001)
  })

  it('ping', async () => {
    const response = await supertest(expressServer.server)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.data.isOnline).toBeTruthy()
    expect(response.body.data.timing).toBeLessThan(10)
    expect(response.body.data.dbStatus).toBe('disconnected')
  })

  it('bad route', async () => {
    const response = await supertest(expressServer.server)
      .get('/bad route ')
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.message).toBe('Not found')
  })
})
