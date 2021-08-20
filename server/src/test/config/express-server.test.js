const request = require('supertest')
const ExpressServer = require('../../configs/express-server')

describe('Base server test', () => {
  let app = null
  beforeAll(async () => {
    app = new ExpressServer()
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  it('server defined', () => {
    expect(ExpressServer).toBeDefined()
  })

  it('port is 3001', () => {
    const { port } = app.server.address() || {}
    expect(port).toBe(3001)
  })

  it('ping', done => {
    request(app.server)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.success).toBeTruthy()
        expect(response.body.isOnline).toBeTruthy()
        expect(typeof response.body.timing).toBe('number')
        expect(response.body.timing).toBeLessThan(10)
        expect(response.body.dbState).toBe('connected')
        done()
      })
  })
})
