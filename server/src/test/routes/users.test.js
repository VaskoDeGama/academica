const supertest = require('supertest')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User, Roles } = require('../../models')

const { mockUsers } = require('../models/mock-data')
const App = require('../../infrastructure/app')
const getCookies = require('../../utils/get-cookies')
const mongoose = require('mongoose')

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

      const { access } = getCookies(auth)
      accessToken = access
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

    it('create user 403', async () => {
      const { body } = await request
        .post('/api/users')
        .send({ username: 'test username', password: 'kekevalid', email: 'testEmail@mail.ru' })
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

      const { access } = getCookies(auth)
      accessToken = access
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

    it('get by bad id 400', async () => {
      const { body } = await request
        .get('/api/users/vary bad id')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(400)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(400)
      const error = body.errors[0]
      expect(error.message).toBe('Bad ID')
      expect(error.type).toBe('ValidationError')
    })

    it('get by bad ids 400', async () => {
      const { body } = await request
        .get(`/api/users?id=123123&id=${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(400)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(400)
      const error = body.errors[0]
      expect(error.message).toBe('Bad ID')
      expect(error.type).toBe('ValidationError')
    })

    it('get by bad ids', async () => {
      const [id1, id2] = mockUsers.filter(u => u.role === Roles.student && u.teacher.toString() === selfId).slice(0, 2).map(u => u._id.toString())

      const { body } = await request
        .get(`/api/users?id=${id1}&id=${id2}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data.count).toBe(2)
    })

    it('get by bad query', async () => {
      const { body } = await request
        .get('/api/users?role=teacher')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      expect(body.success).toBeTruthy()
      expect(body.status).toBe(200)
      expect(body.data.count).toBe(1)
    })

    it('get by bad query 2', async () => {
      const { body } = await request
        .get(`/api/users?role=student&id=${selfId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(404)

      expect(body.success).toBeFalsy()
      expect(body.status).toBe(404)
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

    it('remove self student 200', async () => {
      const selfStudent = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() === selfId)._id.toString()

      const student = await User.findById(selfStudent)

      expect(student.teacher.toString()).toBe(selfId)

      const { body } = await request
        .delete(`/api/users/${selfStudent}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      const afterDelete = await User.findById(selfStudent)
      expect(body.success).toBeTruthy()
      expect(afterDelete).toBe(null)
    })

    it('remove two self students 200', async () => {
      const users = await User.find({ role: Roles.student, teacher: selfId })
      const [id1, id2] = users.slice(0, 2).map(u => u.id)

      const { body } = await request
        .delete(`/api/users?id=${id1}&id=${id2}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      const id1After = await User.findById(id1)
      const id2After = await User.findById(id2)
      expect(body.success).toBeTruthy()
      expect(id1After).toBe(null)
      expect(id2After).toBe(null)
    })

    it('remove one student', async () => {
      const users = await User.find({ role: Roles.student, teacher: selfId })
      const [id1] = users.slice(0, 1).map(u => u.id)

      const { body } = await request
        .delete(`/api/users?id=${id1}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)

      const id1After = await User.findById(id1)
      expect(body.success).toBeTruthy()
      expect(id1After).toBe(null)
    })

    it('remove not self student 400', async () => {
      const selfStudent = mockUsers.find(s => s.role === Roles.student && s.teacher.toString() !== selfId)._id.toString()

      const student = await User.findById(selfStudent)

      expect(student.teacher.toString()).not.toBe(selfId)

      const { body } = await request
        .delete(`/api/users/${selfStudent}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(400)

      const afterDelete = await User.findById(selfStudent)
      expect(body.success).toBeFalsy()
      expect(afterDelete).toEqual(student)
    })

    it('create user', async () => {
      const newStudentId = new mongoose.Types.ObjectId().toString()

      const student = {
        id: newStudentId,
        username: 'TestStudent',
        password: 'TestStudentPassword',
        skype: 'FooBarSkype',
        email: 'foo.bar.email@mail.ru',
        balance: 0,
        lastName: 'Foo',
        firstName: 'Bar',
        role: Roles.student
      }

      const { body } = await request
        .post('/api/users')
        .send(student)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(201)

      const afterCreate = await User.findById(newStudentId)
      expect(body.data).toBe(afterCreate.id)
      expect(body.data).toBe(newStudentId)
      expect(student.username).toBe(afterCreate.username)
      expect(student.lastName).toBe(afterCreate.lastName)
      expect(student.balance).toBe(afterCreate.balance)
      expect(afterCreate.teacher.toString()).toBe(selfId)
    })

    it('create existed username', async () => {
      const newStudentId = new mongoose.Types.ObjectId().toString()
      const existedStudent = mockUsers.find(s => s.role === Roles.student)

      const student = {
        id: newStudentId,
        username: existedStudent.username,
        password: 'TestStudentPassword',
        skype: 'FooBarSkype',
        email: 'foo.bar.email@mail.ru',
        balance: 0,
        lastName: 'Foo',
        firstName: 'Bar',
        role: Roles.student
      }

      const { body } = await request
        .post('/api/users')
        .send(student)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(409)

      const afterCreate = await User.findById(newStudentId)
      const error = body.errors[0]
      expect(error.message).toBe('Same user already exists.')
      expect(error.type).toBe('RequestError')
      expect(afterCreate).toEqual(null)
    })

    it('create existed email', async () => {
      const newStudentId = new mongoose.Types.ObjectId().toString()
      const [existedStudent] = await User.find({ role: Roles.student })
      const student = {
        id: newStudentId,
        username: 'testUsername',
        password: 'TestStudentPassword',
        skype: 'FooBarSkype',
        email: existedStudent.email,
        balance: 0,
        lastName: 'Foo',
        firstName: 'Bar',
        role: Roles.student
      }

      const { body } = await request
        .post('/api/users')
        .send(student)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(409)

      const afterCreate = await User.findById(newStudentId)
      const error = body.errors[0]
      expect(error.message).toBe('Same user already exists.')
      expect(error.type).toBe('RequestError')
      expect(afterCreate).toEqual(null)
    })

    it('create validation error', async () => {
      const newStudentId = new mongoose.Types.ObjectId().toString()

      const student = {
        id: newStudentId,
        username: 'name',
        skype: 'FooBarSkype',
        balance: 'asdasd',
        lastName: 'Foo',
        firstName: 'Bar',
        role: Roles.student
      }

      const { body } = await request
        .post('/api/users')
        .send(student)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(400)

      const afterCreate = await User.findById(newStudentId)
      expect(body.errors.length).toBe(4)
      expect(body.errors[0].message).toBe('Username should be at least 6 chars long and less then 25 chars')
      expect(body.errors[0].type).toBe('ValidationError')
      expect(body.errors[1].message).toBe('Password is required')
      expect(body.errors[1].type).toBe('ValidationError')
      expect(body.errors[2].message).toBe('Email is not valid')
      expect(body.errors[2].type).toBe('ValidationError')
      expect(body.errors[3].message).toBe('Balance should be numeric')
      expect(body.errors[3].type).toBe('ValidationError')
      expect(afterCreate).toEqual(null)
    })
  })
})
