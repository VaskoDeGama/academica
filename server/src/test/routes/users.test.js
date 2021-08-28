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
  let token = null
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })
    server = new ExpressServer(config.server.port)

    await db.connect()
    await server.start()

    await User.create(mockUsers[3])
    const { username, password } = mockUsers[3]
    const resp = await request.post('/api/login').send({ username, password })
    token = resp.body.data.token
  })

  beforeEach(async () => {
    await db.dropCollections('users')
  })

  afterAll(async () => {
    await db.close()
    await server.close()
    await mongod.stop()
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

  it('create ok', async () => {
    const response = await request
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send(mockUsers[0])
      .expect(201)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(201)
    expect(response.body.data.id).toBeDefined()
    expect(response.body.data.id.length).toBe(24)
  })

  it('create validation failed', async () => {
    const response = await request
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'testUser',
        email: 'kek@kek.ru',
        role: 'teacher'
      })
      .expect(400)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(400)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('password')
    expect(response.body.errors[0].message).toBe('Field password is required!')
    expect(response.body.errors[0].type).toBe('ValidationError')
  })

  it('create validation bad email', async () => {
    const response = await request
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'testUser',
        password: 'password',
        role: 'teacher',
        email: 'lek'
      })
      .expect(400)
      .expect('Content-Type', /json/)

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

    const response = await request
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'testUser1',
        password: 'testUser2',
        email: 'testUser2@mail.ru'
      })
      .expect(409)

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

    const response = await request
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'anotherUser',
        password: 'testUser',
        email: 'vaska@mail.ru'
      })
      .expect(409)

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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body.success).toBeFalsy()
    expect(response.body.status).toBe(404)
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].message).toBe('Users not found')
  })

  it('update user by id', async () => {
    await User.create(mockUsers)

    const id = mockUsers[0]._id.toString()
    const [userBeforeUpdate] = await User.find({ _id: id })
    const response = await request
      .put(`/api/users/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        role: 'teacher',
        balance: 10,
        skype: 'userSkype'
      })
      .expect(200)
      .expect('Content-Type', /json/)
    const [userAfterUpdate] = await User.find({ _id: id })
    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data.id).toBe(id)

    expect(userBeforeUpdate.role).toBe('student')
    expect(userBeforeUpdate.balance).toBeGreaterThan(999)
    expect(userBeforeUpdate.id).toBe(id)
    expect(userBeforeUpdate.skype).toBe('UserSkype0')

    expect(userAfterUpdate.role).toBe('teacher')
    expect(userAfterUpdate.balance).toBe(10)
    expect(userAfterUpdate.id).toBe(id)
    expect(userAfterUpdate.skype).toBe('userSkype')
  })

  it('update user by bad id', async () => {
    const id = 'badId'
    await request
      .put(`/api/users/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        role: 'teacher',
        balance: 10,
        skype: 'userSkype'
      })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('update user not found', async () => {
    const id = mockUsers[0]._id.toString()
    await request
      .put(`/api/users/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        role: 'teacher',
        balance: 10,
        skype: 'userSkype'
      })
      .expect(404)
      .expect('Content-Type', /json/)
  })

  it('update user validation failed', async () => {
    await User.create(mockUsers)
    const id = mockUsers[0]._id.toString()
    const res = await request
      .put(`/api/users/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        balance: '12312asdasd',
        skype: 'sdasd',
        role: 'master'
      })
      .expect(400)
      .expect('Content-Type', /json/)

    expect(res.body.errors.length).toBe(3)
  })

  it('delete by id', async () => {
    await User.create(mockUsers)
    const id = mockUsers[0]._id.toString()
    const res = await request
      .delete(`/api/users/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
    const userAfterDelete = await User.find({ _id: id })
    expect(res.body.data.deletedCount).toBe(1)
    expect(userAfterDelete.length).toBe(0)
  })

  it('delete by ids', async () => {
    await User.create(mockUsers)
    const id1 = mockUsers[0]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const res = await request
      .delete(`/api/users/?id=${id1}&id=${id2}&id=${id3}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
    const userAfterDelete = await User.find({ _id: { $in: [id1, id2, id3] } })
    expect(res.body.data.deletedCount).toBe(3)
    expect(userAfterDelete.length).toBe(0)
  })

  it('delete by query', async () => {
    await User.create(mockUsers)
    const teacherIds = mockUsers.filter(u => u.role === 'teacher').map(u => u._id.toString())
    const res = await request
      .delete('/api/users?role=teacher')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
    const userAfterDelete = await User.find({ role: 'teacher' })
    expect(res.body.data.deletedCount).toBe(teacherIds.length)
    expect(userAfterDelete.length).toBe(0)
  })
})
