const supertest = require('supertest')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User } = require('../../models')

const { mockUsers } = require('../models/mock-data')
const App = require('../../infrastructure/app')

describe('Auth routes', () => {
  let mongoServer = null
  let server = null
  let address = null
  let request = null
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: config.db.ip,
        port: config.db.port
      }
    })
    server = new App()

    await server.start(config)
    address = `http://localhost:${config.get('server').port}`
    request = supertest(address)
    await User.create(mockUsers[3])
    await User.create(mockUsers[22])
  })

  beforeEach(async () => {
    await server.db.dropCollections('tokens')
  })

  afterAll(async () => {
    await server.stop()
    await mongoServer.stop()
  })

  it('ping', async () => {
    const response = await request
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.data.isOnline).toBeTruthy()
    expect(response.body.data.timing).toBeLessThan(10)
    expect(response.body.data.dbStatus).toBe('connected')
  })

  it('login ok', async () => {
    const response = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data.token).toBeDefined()
    expect(response.body.data.user.username).toBe(mockUsers[3].username)
    expect(Array.isArray(response.headers['set-cookie'])).toBeTruthy()
    expect(response.headers['set-cookie'].length).toBe(1)
  })

  it('login 404', async () => {
    const response = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username + 1212312,
        password: mockUsers[3].password
      })
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(404)
    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  it('login bad password', async () => {
    const response = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password + 'kek'
      })
      .expect(401)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(401)
    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  it('login create refresh token', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    const token = auth.body.data.token
    const { refresh } = auth.headers['set-cookie'][0].match(/refresh=(?<refresh>[a-f0-9]*);/)?.groups || {}

    const response = await request
      .get('/api/tokens')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data.count).toBe(1)
    expect(response.body.data.tokens[0].token).toBe(refresh)
  })

  it('token expiry', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzExODA0YmM4NzU4NTczOTlkMDVkNiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNjMwNjA3MzY0LCJleHAiOjE2MzA2MDczOTQsImp0aSI6IjYxMzExODA0YmM4NzU4NTczOTlkMDVlMyJ9._7RVm2DYlhanKSF5b4SypeA47dAvIQbkneTPQvpGL4E'
    const { refresh } = auth.headers['set-cookie'][0].match(/refresh=(?<refresh>[a-f0-9]*);/)?.groups || {}

    const { body } = await request
      .get('/api/tokens')
      .set('Authorization', 'Bearer ' + token)
      .set('Cookie', [`refresh=${refresh}`])
      .expect(401)

    expect(body.errors[0].message).toBe('Token expired!')
  })

  it('refresh token no token', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    const token = auth.body.data.token

    const resp = await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    expect(resp.body.errors[0].message).toBe('Token required!')
  })

  it('refresh token', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    const token = auth.body.data.token
    const { refresh } = auth.headers['set-cookie'][0].match(/refresh=(?<refresh>[a-f0-9]*);/)?.groups || {}

    const response = await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + token)
      .set('Cookie', [`refresh=${refresh}`])

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data.token).toBeDefined()
    expect(Array.isArray(response.headers['set-cookie'])).toBeTruthy()
    expect(response.headers['set-cookie'].length).toBe(1)

    const newToken = response.body.data.token
    const { refresh: newRefresh } = response.headers['set-cookie'][0].match(/refresh=(?<refresh>[a-f0-9]*);/)?.groups || {}

    expect(newRefresh).not.toBe(refresh)

    await request
      .get('/api/tokens')
      .set('Cookie', [`refresh=${refresh}`])
      .expect(401)

    await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + newToken)
      .set('Cookie', [`refresh=${newRefresh}`])
      .expect(200)
  })

  it('not permitted 403', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[22].username,
        password: mockUsers[22].password
      })

    const token = auth.body.data.token

    await request
      .post('/api/users/')
      .send({})
      .set('Authorization', 'Bearer ' + token)
      .expect(403)
  })
})
