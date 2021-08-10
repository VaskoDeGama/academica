import { GlobalErrorHandler } from '../../middleware/global-error-handler'
import { FinalMiddleware } from '../../middleware/final-middleware'
import { UserController } from '../../controllers/user-controller'
import { SetMetrics } from '../../middleware/set-metrics'
import { useExpressServer } from 'routing-controllers'
import { loggerConfig } from '../../utils/logger'
import { configure, getLogger } from 'log4js'
import { ReqBody } from '../../models'
import request from 'supertest'
import config from 'config'
import * as http from 'http'
import app from '../../app'

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  let server: http.Server = null

  afterAll(() => {
    server.close()
  })

  beforeAll(() => {
    configure(loggerConfig)
    const port = config.get('Server.port')
    const log = getLogger('Server')

    useExpressServer(app, {
      cors: true,
      defaultErrorHandler: false,
      controllers: [UserController],
      middlewares: [SetMetrics, FinalMiddleware, GlobalErrorHandler]
    })

    server = app.listen(port, () => log.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
  })

  it('postOne', () => {
    const userController = new UserController()
    const testBody = {
      city: 'SPb'
    }
    const res = userController.postOne(1, testBody as ReqBody)
    expect(res).toBeDefined()
  })

  it('postOne with validations', done => {
    request(server)
      .post('/users/1')
      .send({
        city: 'SPb',
        country: 'kek'
      } as ReqBody)
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(JSON.stringify(res.body))

        done()
      })
  })

  it('postOne with failed validations', done => {
    request(server)
      .post('/users/1')
      .send({
        city: 'SPb'
      } as ReqBody)
      .expect(400)
      .end((err, res) => {
        if (err) throw new Error(JSON.stringify(res.body))

        done()
      })
  })
})
