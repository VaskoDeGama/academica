const supertest = require('supertest')
const ExpressServer = require('./../../configs/express-server')
const DataBase = require('./../../configs/database')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User } = require('../../models/user')

describe('User routes', () => {
  let mongod = null
  let db = null
  let server = null
  const address = `http://localhost:${config.get('server').port}`
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })
    server = new ExpressServer(config.server.port)

    await db.connect()
    await server.start()
  })

  afterAll(async () => {
    await db.close()
    await server.close()
    await mongod.stop()
  })

  it('ping', done => {
    supertest(address)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.success).toBeTruthy()
        expect(response.body.data.isOnline).toBeTruthy()
        expect(response.body.data.timing).toBeLessThan(10)
        expect(response.body.data.dbStatus).toBe('connected')

        done()
      })
      .catch(err => done(err))
  })

  it('create ok', done => {
    supertest(address)
      .post('/api/users')
      .send({
        username: 'testUser',
        password: 'testUser'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.success).toBeTruthy()
        expect(response.body.status).toBe(201)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.id.length).toBe(24)
        User.deleteMany().then((res) => {
          expect(res.deletedCount).toBe(1)
          done()
        })
      })
      .catch(err => done(err))
  })

  it('create validation failed', done => {
    supertest(address)
      .post('/api/users')
      .send({
        username: 'testUser',
        role: 'teacher'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.success).toBeFalsy()
        expect(response.body.status).toBe(400)
        expect(response.body.errors.length).toBe(1)
        expect(response.body.errors[0].field).toBe('password')
        expect(response.body.errors[0].message).toBe('Field password is required!')
        expect(response.body.errors[0].type).toBe('ValidationError')
        User.deleteMany().then((res) => {
          expect(res.deletedCount).toBe(0)
          done()
        })
      })
      .catch(err => done(err))
  })

  it('create validation bad email', done => {
    supertest(address)
      .post('/api/users')
      .send({
        username: 'testUser',
        password: 'password',
        role: 'teacher',
        email: 'lek'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.success).toBeFalsy()
        expect(response.body.status).toBe(400)
        expect(response.body.errors.length).toBe(1)
        expect(response.body.errors[0].field).toBe('email')
        expect(response.body.errors[0].message).toBe('Wrong Email')
        expect(response.body.errors[0].type).toBe('ValidationError')
        User.deleteMany().then((res) => {
          expect(res.deletedCount).toBe(0)
          done()
        })
      })
      .catch(err => done(err))
  })

  it('create user with same username', done => {
    const user = new User({
      username: 'testUser1',
      password: 'testUser1'
    })

    user.save(() => {
      supertest(address)
        .post('/api/users')
        .send({
          username: 'testUser1',
          password: 'testUser1'
        })
        .expect(409)
        .then(resp => {
          const { success, status, errors } = resp.body

          expect(success).toBeFalsy()
          expect(status).toBe(409)
          expect(Array.isArray(errors)).toBeTruthy()
          expect(errors.length).toBe(1)
          expect(errors[0].message).toBe('Same user already exists.')
          expect(errors[0].type).toBe('Custom')

          User.deleteMany().then((res) => {
            expect(res.deletedCount).toBe(1)
            done()
          })
        })
        .catch(err => done(err))
    })
  })

  it('create user with same email', done => {
    const user = new User({
      username: 'testUser1',
      password: 'testUser1',
      email: 'vaska@mail.ru'
    })

    user.save(() => {
      supertest(address)
        .post('/api/users')
        .send({
          username: 'testUser',
          password: 'testUser',
          email: 'vaska@mail.ru'
        })
        .expect(409)
        .then(resp => {
          const { success, status, errors } = resp.body
          expect(success).toBeFalsy()
          expect(status).toBe(409)
          expect(Array.isArray(errors)).toBeTruthy()
          expect(errors.length).toBe(1)
          expect(errors[0].message).toBe('Same user already exists.')
          expect(errors[0].type).toBe('Custom')

          User.deleteMany().then((res) => {
            expect(res.deletedCount).toBe(1)
            done()
          })
        })
        .catch(err => done(err))
    })
  })
})
