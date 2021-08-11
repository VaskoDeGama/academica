import { ExpressServer } from '../../utils/express-server'

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

  it('port is 3001', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { port } = app.server.address() || {}
    expect(port).toBe(3001)
  })
})
