import { ExpressServer } from '../../utils/express-server'
import request from 'supertest'

describe('Base server test', () => {
  let app: ExpressServer = null
  beforeAll(() => {
    app = new ExpressServer().start()
  })

  afterAll(() => {
    app.stop()
  })

  it('server defined', () => {
    expect(ExpressServer).toBeDefined()
  })

  it('port is 3001', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { port } = app.server.address() || {}
    expect(port).toBe(3001)
  })

  it('ping', (done) => {
    request(app.server)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.success).toBeTruthy()
        expect(response.body.isOnline).toBeTruthy()
        expect(typeof response.body.timing).toBe('number')
        expect(response.body.timing).toBeLessThan(10)
        done()
      })
  })
})
