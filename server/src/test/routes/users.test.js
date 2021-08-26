const supertest = require('supertest')
const ExpressServer = require('./../../configs/express-server')
const DataBase = require('./../../configs/database')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User } = require('../../models/user')

const { mockUsersLength, mockUsers } = require('./../models/mock-users')

describe('User routes', () => {
  let mongod = null
  let db = null
  let server = null
  const address = `http://localhost:${config.get('server').port}`
  const request = supertest(address)
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })
    server = new ExpressServer(config.server.port)

    await db.connect()
    await server.start()
  })

  afterEach(async () => {
    await db.dropCollections('users')
  })

  afterAll(async () => {
    await db.close()
    await server.close()
    await mongod.stop()
  })

  it('ping', async () => {
    const response = await request.get('/').expect(200).expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.data.isOnline).toBeTruthy()
    expect(response.body.data.timing).toBeLessThan(10)
    expect(response.body.data.dbStatus).toBe('connected')
  })

  it('create ok', async () => {
    const response = await request.post('/api/users').send(mockUsers[0]).expect(201).expect('Content-Type', /json/)
    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(201)
    expect(response.body.data.id).toBeDefined()
    expect(response.body.data.id.length).toBe(24)
  })

  it('create validation failed', async () => {
    const response = await request.post('/api/users').send({
      username: 'testUser',
      email: 'kek@kek.ru',
      role: 'teacher'
    }).expect(400).expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(400)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('password')
    expect(response.body.errors[0].message).toBe('Field password is required!')
    expect(response.body.errors[0].type).toBe('ValidationError')
  })

  it('create validation bad email', async () => {
    const response = await request.post('/api/users').send({
      username: 'testUser',
      password: 'password',
      role: 'teacher',
      email: 'lek'
    }).expect(400).expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(400)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('email')
    expect(response.body.errors[0].message).toBe('Wrong Email')
    expect(response.body.errors[0].type).toBe('ValidationError')
  })

  it('create user with same username', async () => {
    const user = new User({
      username: 'testUser1',
      password: 'testUser1',
      email: 'testUser1@mail.ru'
    })

    await user.save()

    const response = await request.post('/api/users').send({
      username: 'testUser1',
      password: 'testUser2',
      email: 'testUser2@mail.ru'
    }).expect(409)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(409)
    expect(Array.isArray(response.body.errors)).toBeTruthy()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].message).toBe('Same user already exists.')
    expect(response.body.errors[0].type).toBe('Custom')
  })

  it('create user with same email', async () => {
    const user = new User({
      username: 'testUser1',
      password: 'testUser1',
      email: 'vaska@mail.ru'
    })

    await user.save()

    const response = await request.post('/api/users').send({
      username: 'anotherUser',
      password: 'testUser',
      email: 'vaska@mail.ru'
    }).expect(409)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(409)
    expect(Array.isArray(response.body.errors)).toBeTruthy()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].message).toBe('Same user already exists.')
    expect(response.body.errors[0].type).toBe('Custom')
  })

  it('no users', async () => {
    const response = await request
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(0)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(0)
  })

  it('get all', async () => {
    await User.create(mockUsers)
    const response = await request
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(mockUsersLength)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(mockUsersLength)
  })

  it('get user by id', async () => {
    await User.create(mockUsers)

    const response = await request
      .get(`/api/users?id=${mockUsers[0]._id.toString()}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(1)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(1)
    expect(response.body.data.users[0].username).toBe(mockUsers[0].username)
  })

  it('get user by bad id', async () => {
    await User.create(mockUsers)

    const response = await request
      .get(`/api/users?id=${mockUsers[0]._id.toString().slice(1)}`)
      .expect(400)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })

  it('get users by ids', async () => {
    await User.create(mockUsers)

    const response = await request
      .get(`/api/users?id=${mockUsers[0]._id.toString()}&id=${mockUsers[1]._id.toString()}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(2)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(2)
    expect(response.body.data.users[0].username).toBe(mockUsers[0].username)
    expect(response.body.data.users[1].username).toBe(mockUsers[1].username)
  })

  it('get users by query', async () => {
    await User.create(mockUsers)

    const response = await request
      .get('/api/users?role=teacher')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(3)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(3)
    expect(response.body.data.users.every(u => u.role === 'teacher')).toBeTruthy()
  })

  it('get users by query with id good', async () => {
    await User.create(mockUsers)

    const response = await request
      .get(`/api/users?role=teacher&id=${mockUsers[1]._id.toString()}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.count).toBe(1)
    expect(Array.isArray(response.body.data.users)).toBeTruthy()
    expect(response.body.data.users.length).toBe(1)
    expect(response.body.data.users[0].username).toBe(mockUsers[1].username)
  })

  it('get users by query with id bad', async () => {
    await User.create(mockUsers)

    const response = await request
      .get(`/api/users?role=teacher&id=${mockUsers[2]._id.toString()}`)
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(404)
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].message).toBe('Users not found')
  })

  it('get users by bad query', async () => {
    await User.create(mockUsers)

    const response = await request
      .get('/api/users?role=badRole')
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(404)
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].message).toBe('Users not found')
  })
})
