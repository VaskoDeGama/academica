'use strict'
const DataBase = require('./../../configs/database')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User, Role } = require('../../models/')
const { mockUsers, mockUsersLength, roles } = require('../models/mock-data')
const { MongoRepository } = require('../../repositories')
const { appLogger } = require('../../utils/logger')
const mongoose = require('mongoose')

describe('mongo repository', () => {
  let mongoServer = null
  let db = null
  const repository = new MongoRepository(User)
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: config.db.ip,
        port: config.db.port
      }
    })
    db = new DataBase(appLogger)
    await db.connect({ url: mongoServer.getUri(), name: config.get('db').name })
    await Role.create(roles)
    await User.create(mockUsers)
  })

  afterAll(async () => {
    await db.close()
    await mongoServer.stop()
  })

  it('findAll', async () => {
    const users = await repository.getAll()
    expect(users.length).toBe(mockUsersLength)
  })

  it('select', async () => {
    const [user] = await repository.getAll({ email: 1, username: 1 })
    expect(user.username).toBeDefined()
    expect(user.email).toBeDefined()
    expect(user.balance).not.toBeDefined()
    expect(user.role).not.toBeDefined()
  })

  it('options', async () => {
    const id = mockUsers[0]._id.toString()
    const users = await repository.getAll({ email: 1, username: 1 }, { skip: 5 })
    expect(users[0].id).not.toBe(id)
    expect(users[0].username).toBeDefined()
    expect(users[0].email).toBeDefined()
    expect(users[0].balance).not.toBeDefined()
    expect(users[0].role).not.toBeDefined()
    expect(users.length).toBe(40)
  })

  it('findById', async () => {
    const id = mockUsers[0]._id.toString()
    const user = await repository.findById(id)
    expect(user.username).toBe(mockUsers[0].username)
    expect(user.id).toBe(id)
  })

  it('findByIds', async () => {
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const users = await repository.findByIds([id1, id2, id3])
    expect(users.length).toBe(3)
    expect(users.every(u => [id1, id2, id3].includes(u.id))).toBeTruthy()
  })

  it('findByQuery', async () => {
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[22]._id.toString()
    const users = await repository.findByQuery({
      $and: [
        { _id: { $in: [id1, id2, id3] } }
      ]
    }, {}, {})
    expect(users.length).toBe(3)
  })

  it('save', async () => {
    const _id = new mongoose.Types.ObjectId()
    await repository.save({
      _id,
      username: 'testUser',
      password: 'testUser',
      email: 'testUser@email.ru'
    })
    const user = await User.findById(_id.toString())
    expect(user.id).toBe(_id.toString())
    expect(user.username).toBe('testUser')
  })

  it('removeById', async () => {
    const res = await repository.removeById(mockUsers[0]._id.toString())

    const users = await User.find({ _id: mockUsers[0]._id.toString() })

    expect(res.deletedCount).toBe(1)
    expect(users.length).toBe(0)
  })

  it('removeByIds', async () => {
    const id1 = mockUsers[33]._id.toString()
    const id2 = mockUsers[32]._id.toString()
    const id3 = mockUsers[31]._id.toString()
    const res = await repository.removeByIds([id1, id2, id3])

    const users = await User.find({ _id: { $in: [id1, id2, id3] } })

    expect(res.deletedCount).toBe(3)
    expect(users.length).toBe(0)
  })

  it('removeByQuery', async () => {
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[22]._id.toString()
    const res = await repository.removeByQuery({
      $and: [
        { role: roles[1]._id.toString() },
        { _id: { $in: [id1, id2, id3] } }
      ]
    })

    const users = await User.find(
      { _id: { $in: [id1, id2, id3] } }
    )

    expect(res.deletedCount).toBe(2)
    expect(users.length).toBe(1)
  })

  it('findAndUpdate', async () => {
    const id = mockUsers[22]._id.toString()
    const res = await repository.findAndUpdate({ _id: id }, { balance: 10 })

    const users = await User.find({ _id: id })
    expect(res.balance).toBe(10)
    expect(users.length).toBe(1)
    expect(users[0].balance).toBe(10)
  })

  it('populate', async () => {
    const [res] = await repository.findByQuery({ role: roles[1]._id.toString() }, {}, { populate: 'role students' })

    expect(res.role.name).toBe('teacher')
    expect(res.students[0].username).toBeDefined()
  })
})
