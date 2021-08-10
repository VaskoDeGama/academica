import { ReqBody } from '../../src/models'
import { UserController } from '../../src/controllers'
import request from 'supertest'
import { Server } from 'http'
import app from './../../src/app'
import config from 'config'

describe('UserController', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  let server : Server = null

  beforeEach(async () => {
    const port = config.get('Server.port')
    server = app.listen(port, () => console.info(`Express server listening on port: ${port}, with pid: ${process.pid}`))
  })

  it('postOne', () => {
    const userController = new UserController()
    const testBody = {
      city: 'SPb'
    }
    const res = userController.postOne(1, testBody as ReqBody)
    console.log(res)
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
