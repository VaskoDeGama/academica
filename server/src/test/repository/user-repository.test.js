'use strict'

const { MongoMemoryServer } = require('mongodb-memory-server')
const DataBase = require('../../configs/database')
const UserRepository = require('../../repositories/user-repository')
const config = require('config')
const { User } = require('../../models/user')
const { mockUsersLength, mockUsers } = require('./../models/mock-users')

describe('UserRepository', () => {
  let db = null
  let mongod = null
  let userRepo = null
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })

    await db.connect()

    userRepo = new UserRepository(User)
  })

  beforeEach(async () => {
    const users = await User.find()
    if (users.length) {
      await db.getConnection().dropCollection('users')
    }
  })

  afterAll(async () => {
    await db.close()
    await mongod.stop()
  })

  it('findById', async () => {
    await userRepo.saveUser(mockUsers[0])
    const userFromDb = await userRepo.findUserById(mockUsers[0]._id.toString())

    expect(userFromDb.username).toBe(mockUsers[0].username)
    expect(userFromDb.id).toBe(mockUsers[0]._id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('saveUser', async () => {
    const resp = await userRepo.saveUser(mockUsers[0])
    const userFromDb = await userRepo.findUserById(resp.id)

    expect(userFromDb.username).toBe(mockUsers[0].username)
    expect(userFromDb.id).toBe(mockUsers[0]._id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('getAll', async () => {
    await User.create(mockUsers)
    const usersFromDb = await userRepo.getAllUsers()

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(mockUsersLength)
  })

  it('findManyById', async () => {
    await User.create(mockUsers)
    const ids = mockUsers.map(u => u._id.toString()).slice(0, mockUsersLength / 2)
    const usersFromDb = await userRepo.findUsersByIds(ids)

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(mockUsersLength / 2)
  })

  it('findManyByQuery', async () => {
    await User.create(mockUsers)
    const usersFromDb = await userRepo.findUsersByQuery({
      role: 'teacher'
    })

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb[0].role).toBe('teacher')
    expect(usersFromDb.length).toBe(3)
  })

  it('removeById', async () => {
    const id = mockUsers[0]._id
    const hasBeforeCreate = !!await userRepo.findUserById(id.toString())
    expect(hasBeforeCreate).toBeFalsy()
    await User.create(mockUsers[0])
    const hasAfterCreate = !!await userRepo.findUserById(id.toString())
    expect(hasAfterCreate).toBeTruthy()
    const res = await userRepo.removeUserById(id.toString())
    expect(res.deletedCount).toBe(1)
    const hasAfterDelete = !!await userRepo.findUserById(id.toString())
    expect(hasAfterDelete).toBeFalsy()
  })

  it('removeByIds', async () => {
    await User.create(mockUsers)
    const res = await userRepo.removeUsersByQuery({
      role: 'student'
    })
    const documents = await User.find()
    expect(res.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })

  it('update', async () => {
    await User.create(mockUsers)
    const id = mockUsers[0]._id
    const res = await userRepo.findUserAndUpdate(id.toString(), {
      role: 'teacher'
    })
    const user = await userRepo.findUserById(id.toString())

    expect(res.id).toBe(id.toString())
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('teacher')
  })

  it('update not found', async () => {
    const id = mockUsers[0]._id

    await User.create(mockUsers[0])
    const res = await userRepo.findUserAndUpdate(id.toString().split('').reverse().join(''), {
      role: 'teacher'
    })

    const user = await userRepo.findUserById(id.toString())

    expect(res).toBeNull()
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('student')
  })
})
