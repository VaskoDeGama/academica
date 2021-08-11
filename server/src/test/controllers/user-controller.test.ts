import { UserController } from '../../controllers/user-controller'
import { ReqBody } from '../../models'
import request from 'supertest'
import { Application } from '../../utils/application'
import * as http from 'http'

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  let server: http.Server = null

  afterAll(() => {
    server.close()
  })

  beforeAll(() => {
    const app = new Application().start()
    server = app.server
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
