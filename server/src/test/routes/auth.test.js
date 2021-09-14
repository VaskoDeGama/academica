const supertest = require('supertest')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User } = require('../../models')

const { mockUsers } = require('../models/mock-data')
const getCookies = require('../../utils/get-cookies')
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
    await User.create(mockUsers)
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

  it('authenticate', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)
  })

  it('teacher get self student ok', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')
    const studentId = teacher.students[0]._id.toString()

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    await request
      .get(`/api/users/${studentId}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)
  })

  it('teacher get self ok', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    await request
      .get(`/api/users/${teacher._id.toString()}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)
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
    expect(response.body.data.username).toBe(mockUsers[3].username)
    expect(Array.isArray(response.headers['set-cookie'])).toBeTruthy()
    expect(response.headers['set-cookie'].length).toBe(2)
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

    const { access, refresh } = getCookies(auth)

    const response = await request
      .get('/api/tokens')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(response.body.data.count).toBe(1)
    expect(response.body.data.tokens[0].token).toBe(refresh.value)
  })

  it('token expiry', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    // noinspection SpellCheckingInspection
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzExODA0YmM4NzU4NTczOTlkMDVkNiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNjMwNjA3MzY0LCJleHAiOjE2MzA2MDczOTQsImp0aSI6IjYxMzExODA0YmM4NzU4NTczOTlkMDVlMyJ9._7RVm2DYlhanKSF5b4SypeA47dAvIQbkneTPQvpGL4E'
    const { refresh } = getCookies(auth)

    const { body } = await request
      .get('/api/tokens')
      .set('Authorization', 'Bearer ' + token)
      .set('Cookie', [`refresh=${refresh.value}`])
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

    const { access } = getCookies(auth)

    const resp = await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(400)

    expect(resp.body.errors[0].message).toBe('Refresh token required!')
  })

  it('refresh token', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[3].username,
        password: mockUsers[3].password
      })

    const { access, refresh } = getCookies(auth)

    const response = await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + access.value)
      .set('Cookie', [`refresh=${refresh.value}`])

    expect(response.body.success).toBeTruthy()
    expect(response.body.status).toBe(200)
    expect(Array.isArray(response.headers['set-cookie'])).toBeTruthy()
    expect(response.headers['set-cookie'].length).toBe(2)

    const { access: newAccess, refresh: newRefresh } = getCookies(response)

    await request
      .get('/api/tokens')
      .set('Authorization', 'Bearer ' + access.value)
      .set('Cookie', [`refresh=${refresh.value}`])
      .expect(401)

    await request
      .get('/api/refresh')
      .set('Authorization', 'Bearer ' + newAccess.value)
      .set('Cookie', [`refresh=${newRefresh.value}`])
      .expect(200)
  })

  it('not permitted 403', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[22].username,
        password: mockUsers[22].password
      })

    const { access } = getCookies(auth)

    await request
      .post('/api/users/')
      .send({})
      .set('Authorization', 'Bearer ' + access.value)
      .expect(403)
  })

  it('student get not owned', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[22].username,
        password: mockUsers[22].password
      })

    const { access } = getCookies(auth)

    await request
      .get(`/api/users/${mockUsers[21]._id.toString()}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(404)
  })

  it('student get self', async () => {
    const auth = await request
      .post('/api/login')
      .send({
        username: mockUsers[22].username,
        password: mockUsers[22].password
      })

    const { access } = getCookies(auth)

    await request
      .get(`/api/users/${mockUsers[22]._id.toString()}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)
  })

  it('teacher get all onlyOwned', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')
    const users = mockUsers.filter(user => user._id === teacher._id || user?.teacher === teacher._id)

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    const { body } = await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    expect(body.data.users.length).toBe(users.length)
  })

  it('teacher get another student 404', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')
    const student = mockUsers.find(user => user.role === 'student' && user.teacher !== teacher._id)

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    await request
      .get(`/api/users/${student._id.toString()}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(404)
  })

  it('student get all 403', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(403)
  })

  it('admin get all', async () => {
    const admin = mockUsers.find(user => user.role === 'admin')

    const auth = await request
      .post('/api/login')
      .send({
        username: admin.username,
        password: admin.password
      })

    const { access } = getCookies(auth)

    const { body } = await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    expect(body.data.count).toBe(45)
  })

  it('student can\'t update balance', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .put(`/api/users/${student._id.toString()}`)
      .send({ balance: 2000 })
      .set('Authorization', 'Bearer ' + access.value)
      .expect(400)
  })

  it('teacher can update balance', async () => {
    const teacher = mockUsers.find(user => user.role === 'teacher')
    const student = mockUsers.find(user => user.role === 'student' && user.teacher === teacher._id)

    const auth = await request
      .post('/api/login')
      .send({
        username: teacher.username,
        password: teacher.password
      })

    const { access } = getCookies(auth)

    await request
      .put(`/api/users/${student._id.toString()}`)
      .send({ balance: 2000 })
      .set('Authorization', 'Bearer ' + access.value)

    const { body } = await request
      .get(`/api/users/${student._id.toString()}`)
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    expect(body.data.id).toBe(student._id.toString())
    expect(body.data.balance).toBe(2000)
  })

  it('student  can update password', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)
    student.password = 'newPassword'

    await request
      .put(`/api/users/${student._id.toString()}`)
      .send({ password: student.password })
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    const resp = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })
      .expect(200)

    const { access: newAccess } = getCookies(resp)

    await request
      .get(`/api/users/${student._id.toString()}`)
      .set('Authorization', 'Bearer ' + newAccess.value)
      .expect(200)
  })

  it('student can update password same password', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .put(`/api/users/${student._id.toString()}`)
      .send({ password: student.password })
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    const resp = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })
      .expect(200)

    const { access: newAccess } = getCookies(resp)

    await request
      .get(`/api/users/${student._id.toString()}`)
      .set('Authorization', 'Bearer ' + newAccess.value)
      .expect(200)
  })

  it('revoke token without token 400', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .get('/api/logout')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(400)
  })

  it('logout token with out refresh', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .get('/api/logout')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(400)
  })

  it('logout', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access, refresh } = getCookies(auth)

    await request
      .get('/api/logout')
      .set('Cookie', [`refresh=${refresh.value}`])
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)
  })

  it('logout bad refresh', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access, refresh } = getCookies(auth)

    await request
      .get('/api/logout')
      .set('Cookie', [`refresh=${refresh.value + ' 12312'}`])
      .set('Authorization', 'Bearer ' + access.value)
      .expect(401)
  })

  it('revoke token', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { access } = getCookies(auth)

    await request
      .get('/api/logout')
      .set('Authorization', 'Bearer ' + access.value)
      .expect(400)
  })

  it('refresh token with out access token', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { refresh } = getCookies(auth)

    await request
      .get('/api/refresh')
      .set('Cookie', [`refresh=${refresh.value}`])
      // .set('Authorization', 'Bearer ' + access.value)
      .expect(400)
  })

  it('refresh token with old token', async () => {
    const student = mockUsers.find(user => user.role === 'student')

    const auth = await request
      .post('/api/login')
      .send({
        username: student.username,
        password: student.password
      })

    const { refresh, access } = getCookies(auth)

    const resp = await request
      .get('/api/refresh')
      .set('Cookie', [`refresh=${refresh.value}`])
      .set('Authorization', 'Bearer ' + access.value)
      .expect(200)

    const { access: newAccess } = getCookies(resp)

    await request
      .get('/api/refresh')
      .set('Cookie', [`refresh=${refresh.value}`])
      .set('Authorization', 'Bearer ' + newAccess.value)
      .expect(401)
  })
})
