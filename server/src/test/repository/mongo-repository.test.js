'use strict'
const DataBase = require('./../../configs/database')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { User } = require('../../models/')
const { mockUsers, mockUsersLength } = require('../models/mock-users')
const { MongoRepository } = require('../../repositories')

describe('mongo repository', () => {
  let mongod = null
  let db = null
  const repository = new MongoRepository(User)
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })

    await db.connect()
  })

  afterEach(async () => {
    await db.dropCollections('users')
  })

  afterAll(async () => {
    await db.close()
    await mongod.stop()
  })

  it('findAll', async () => {
    await User.create(mockUsers)

    const users = await repository.getAll()
    expect(users.length).toBe(mockUsersLength)
  })

  it('select', async () => {
    await User.create(mockUsers)
    const [user] = await repository.getAll({ email: 1, username: 1 })
    expect(user.username).toBeDefined()
    expect(user.email).toBeDefined()
    expect(user.balance).not.toBeDefined()
    expect(user.role).not.toBeDefined()
  })

  it('options', async () => {
    await User.create(mockUsers)
    const id = mockUsers[0]._id.toString()
    const users = await repository.getAll({ email: 1, username: 1 }, { skip: 5 })
    expect(users[0].id).not.toBe(id)
    expect(users[0].username).toBeDefined()
    expect(users[0].email).toBeDefined()
    expect(users[0].balance).not.toBeDefined()
    expect(users[0].role).not.toBeDefined()
    expect(users.length).toBe(5)
  })

  it('findById', async () => {
    await User.create(mockUsers)
    const id = mockUsers[0]._id.toString()
    const user = await repository.findById(id)
    expect(user.username).toBe(mockUsers[0].username)
    expect(user.id).toBe(id)
  })

  it('findByIds', async () => {
    await User.create(mockUsers)
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const users = await repository.findByIds([id1, id2, id3])
    expect(users.length).toBe(3)
    expect(users.every(u => [id1, id2, id3].includes(u.id))).toBeTruthy()
  })

  it('findByQuery', async () => {
    await User.create(mockUsers)
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const users = await repository.findByQuery({
      $and: [
        { role: 'teacher' },
        { _id: { $in: [id1, id2, id3] } }
      ]
    })
    expect(users.length).toBe(2)
    expect(users[0].id).toBe(id1)
    expect(users[1].id).toBe(id3)
  })

  it('save', async () => {
    await repository.save(mockUsers[0])
    const [user] = await User.find()
    expect(user.id).toBe(mockUsers[0]._id.toString())
    expect(user.username).toBe(mockUsers[0].username)
  })

  it('removeById', async () => {
    await User.create(mockUsers)
    const res = await repository.removeById(mockUsers[0]._id.toString())

    const users = await User.find({ _id: mockUsers[0]._id.toString() })

    expect(res.deletedCount).toBe(1)
    expect(users.length).toBe(0)
  })

  it('removeByIds', async () => {
    await User.create(mockUsers)

    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const res = await repository.removeByIds([id1, id2, id3])

    const users = await User.find({ _id: { $in: [id1, id2, id3] } })

    expect(res.deletedCount).toBe(3)
    expect(users.length).toBe(0)
  })

  it('removeByQuery', async () => {
    await User.create(mockUsers)
    const id1 = mockUsers[1]._id.toString()
    const id2 = mockUsers[2]._id.toString()
    const id3 = mockUsers[3]._id.toString()
    const res = await repository.removeByQuery({
      $and: [
        { role: 'teacher' },
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
    await User.create(mockUsers)

    const id = mockUsers[3]._id.toString()
    const res = await repository.findAndUpdate({ _id: id }, { balance: 10 })

    const users = await User.find({ _id: id })
    expect(res.balance).toBe(10)
    expect(users.length).toBe(1)
    expect(users[0].balance).toBe(10)
  })
})
