import { ReqBody } from '../../src/models'
import { UserController } from '../../src/controllers'
import request from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import { GlobalErrorHandler } from '../../src/middleware'

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  let server

  beforeAll(async () => {
    server = express()
    server.use(bodyParser.json())
    useExpressServer(server, {
      controllers: [UserController],
      middlewares: [GlobalErrorHandler],
      defaultErrorHandler: false
    })
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
