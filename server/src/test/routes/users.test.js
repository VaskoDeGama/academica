const supertest = require('supertest')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User, Roles } = require('../../models')

const { mockUsers } = require('../models/mock-data')
const App = require('../../infrastructure/app')
const getCookies = require('../../utils/get-cookies')

describe('User routes', () => {
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
    const { body } = await request.get('/').expect(200).expect('Content-Type', /json/)

    expect(body.success).toBeTruthy()
    expect(body.data.isOnline).toBeTruthy()
    expect(body.data.timing).toBeLessThan(10)
    expect(body.data.dbStatus).toBe('connected')
    expect(body.data.cacheStatus).toBe('connected')
  })

  describe('students', () => {
    let accessToken = null
    let refreshToken = null
    let selfId = null

    beforeEach(async () => {
      const { password, username, _id } = mockUsers.find(s => s.role === Roles.student)
      selfId = _id.toString()

      const auth = await request
        .post('/api/login')
        .send({
          username,
          password
        })

      const { access, refresh } = getCookies(auth)
      accessToken = access
      refreshToken = refresh
    })

    it('get without token', async () => {
      const { body } = await request
        .get('/api/users')
        .set('Authorization', 'Bearer ' + 'badToken')

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(401)
      const error = body.errors[0]
      expect(error.message).toBe('Token required!')
      expect(error.type).toBe('UnauthorizedError')
    })

    it('get all receive 403', async () => {
      const { body } = await request
        .get('/api/users')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(403)

      expect(body.success).toBeFalsy()
    })

    it('get by id not self 404', async () => {
      const notSelfId = mockUsers.find(s => s.role === Roles.student && s._id.toString() !== selfId)._id.toString()
      const { body } = await request
        .get(`/api/users/${notSelfId}`)
        .set('Authorization', 'Bearer ' + accessToken)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(404)
      const error = body.errors[0]
      expect(error.message).toBe('Resource not found')
      expect(error.type).toBe('RequestError')
    })

    it('get by id self 200', async () => {
      const { body } = await request
        .get(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data).toBeDefined()
    })

    it('update self permitted filed', async () => {
      const userBeforeUpdate = await User.findById(selfId)

      const { body } = await request
        .put(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ lastName: 'Bar' })
        .expect(200)

      const userAfterUpdate = await User.findById(selfId)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data).toBe(selfId)
      expect(userBeforeUpdate.lastName).not.toBe(userAfterUpdate.lastName)
      expect(userAfterUpdate.lastName).toBe('Bar')
    })

    it('update self not permitted filed', async () => {
      const userBeforeUpdate = await User.findById(selfId)

      const { body } = await request
        .put(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ balance: 2000 })
        .expect(400)

      const userAfterUpdate = await User.findById(selfId)
      expect(body.success).toBeFalsy()
      expect(body.status).toBe(400)
      expect(userBeforeUpdate.balance).toBe(userAfterUpdate.balance)
      const error = body.errors[0]
      expect(error.message).toBe('Bad request')
      expect(error.type).toBe('RequestError')
    })

    it('remove user 403', async () => {
      const { body } = await request
        .delete(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(403)

      expect(body.success).toBeFalsy()
    })
  })

  describe('teacher', () => {
    let accessToken = null
    let refreshToken = null
    let selfId = null

    beforeEach(async () => {
      const { password, username, _id } = mockUsers.find(s => s.role === Roles.teacher)
      selfId = _id.toString()

      const auth = await request
        .post('/api/login')
        .send({
          username,
          password
        })

      const { access, refresh } = getCookies(auth)
      accessToken = access
      refreshToken = refresh
    })

    it('get without token', async () => {
      const { body } = await request
        .get('/api/users')
        .set('Authorization', 'Bearer ' + 'badToken')

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(401)
      const error = body.errors[0]
      expect(error.message).toBe('Token required!')
      expect(error.type).toBe('UnauthorizedError')
    })

    it('get all received only owned students', async () => {
      const { body } = await request
        .get('/api/users')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      expect(body.success).toBeTruthy()
      expect(body.data.users.every(s => s.role === Roles.student ? s.teacher.toString() === selfId : s.id === selfId)).toBeTruthy()
    })

    it('get by id not self student', async () => {
      const notSelfId = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() !== selfId)._id.toString()
      const { body } = await request
        .get(`/api/users/${notSelfId}`)
        .set('Authorization', 'Bearer ' + accessToken)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(404)
      const error = body.errors[0]
      expect(error.message).toBe('Resource not found')
      expect(error.type).toBe('RequestError')
    })

    it('get by id  self student', async () => {
      const notSelfId = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() === selfId)._id.toString()
      const { body } = await request
        .get(`/api/users/${notSelfId}`)
        .set('Authorization', 'Bearer ' + accessToken)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data.teacher.toString()).toBe(selfId)
    })

    it('get by id self 200', async () => {
      const { body } = await request
        .get(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data).toBeDefined()
    })

    it('update self', async () => {
      const userBeforeUpdate = await User.findById(selfId)

      const { body } = await request
        .put(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ lastName: 'Bar' })
        .expect(200)

      const userAfterUpdate = await User.findById(selfId)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data).toBe(selfId)
      expect(userBeforeUpdate.lastName).not.toBe(userAfterUpdate.lastName)
      expect(userAfterUpdate.lastName).toBe('Bar')
    })

    it('update not own student field', async () => {
      const notSelfStudentId = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() !== selfId)._id.toString()
      const userBeforeUpdate = await User.findById(notSelfStudentId)

      const { body } = await request
        .put(`/api/users/${notSelfStudentId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ lastName: 'Bar' })
        .expect(404)

      const userAfterUpdate = await User.findById(notSelfStudentId)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(404)
      const error = body.errors[0]
      expect(error.message).toBe('Resource not found')
      expect(error.type).toBe('RequestError')
      expect(userBeforeUpdate).toEqual(userAfterUpdate)
    })

    it('update own student field', async () => {
      const selfStudent = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() === selfId)._id.toString()
      const userBeforeUpdate = await User.findById(selfStudent)

      const { body } = await request
        .put(`/api/users/${selfStudent}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ lastName: 'TEST' })
        .expect(200)

      const userAfterUpdate = await User.findById(selfStudent)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data).toBe(selfStudent)
      expect(userBeforeUpdate.lastName).not.toBe(userAfterUpdate.lastName)
      expect(userAfterUpdate.lastName).toBe('TEST')
    })

    it('remove self 400', async () => {
      const { body } = await request
        .delete(`/api/users/${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(400)

      expect(body.success).toBeFalsy()
    })

    // it('remove self student 200', async () => {
    //   // TODO
    //   const selfStudent = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() === selfId)._id.toString()
    //
    //   const student = await User.findById(selfStudent)
    //   const { body } = await request
    //     .delete(`/api/users/${selfStudent}`)
    //     .set('Authorization', 'Bearer ' + accessToken)
    //     .expect(200)
    //
    //   const afterDelete = await User.findById(selfStudent)
    //   console.log(body)
    //   expect(body.success).toBeTruthy()
    //   expect(afterDelete).toBe(null)
    // })
  })
})
