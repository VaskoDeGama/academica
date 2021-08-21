'use strict'

const { MongoMemoryServer } = require('mongodb-memory-server')
const DataBase = require('../../configs/database')
const UserRepository = require('../../repositories/user-repository')
const mongoose = require('mongoose')
const userSchema = require('../../models/user')
const config = require('config')

describe('UserRepository', () => {
  let db = null
  let mongod = null
  let userRepo = null
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })

    await db.connect()

    userRepo = new UserRepository('users', userSchema)
  })

  beforeEach(async () => {
    await db.getConnection().dropCollection('users')
  })

  afterAll(async () => {
    await db.close()
    await mongod.stop()
  })

  it('findById', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockUser = {
      _id: id,
      username: 'findById',
      password: 'findByIdpassword'
    }
    await userRepo.saveUser(mockUser)
    const userFromDb = await userRepo.findUserById(id.toString())

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.id).toBe(id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('saveUser', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockUser = {
      _id: id,
      username: 'test1',
      password: 'test1password'
    }
    const resp = await userRepo.saveUser(mockUser)
    const userFromDb = await userRepo.findUserById(resp._id)

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.id).toBe(id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('getAll', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await userRepo.saveUser({
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await userRepo.getAllUsers()

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length)
  })

  it('findManyById', async () => {
    const length = 10
    const ids = []
    for (let i = 0; i < length; i += 1) {
      const id = new mongoose.Types.ObjectId()
      ids.push(id.toString())
      await userRepo.saveUser({
        _id: id,
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await userRepo.findUsersByIds(ids.slice(0, length / 2))

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length / 2)
  })

  it('findManyByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await userRepo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userRepo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const usersFromDb = await userRepo.findUsersByQuery({
      role: 'teacher'
    })

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb[0].role).toBe('teacher')
    expect(usersFromDb.length).toBe(3)
  })

  it('removeById', async () => {
    const id = new mongoose.Types.ObjectId()
    const hasBeforeCreate = !!await userRepo.findUserById(id.toString())

    expect(hasBeforeCreate).toBeFalsy()

    await userRepo.saveUser({
      _id: id,
      username: 'username',
      password: 'password'
    })

    const hasAfterCreate = !!await userRepo.findUserById(id.toString())
    expect(hasAfterCreate).toBeTruthy()
    const res = await userRepo.removeUserById(id.toString())

    expect(res.deletedCount).toBe(1)

    const hasAfterDelete = !!await userRepo.findUserById(id.toString())
    expect(hasAfterDelete).toBeFalsy()
  })

  it('removeByIds', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await userRepo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userRepo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const res = await userRepo.removeUsersByQuery({
      role: 'student'
    })

    const documents = await userRepo.getAllUsers()

    expect(res.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })

  it('update', async () => {
    const id = new mongoose.Types.ObjectId()
    await userRepo.saveUser({
      _id: id,
      username: 'username',
      password: 'password'
    })

    const res = await userRepo.findUserAndUpdate(id.toString(), {
      role: 'teacher'
    })

    const user = await userRepo.findUserById(id.toString())

    expect(res.id).toBe(id.toString())
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('teacher')
  })

  it('update not found', async () => {
    const id = new mongoose.Types.ObjectId()

    await userRepo.saveUser({
      _id: id.toString(),
      username: 'username',
      password: 'password'
    })

    const res = await userRepo.findUserAndUpdate(id.toString().split('').reverse().join(''), {
      role: 'teacher'
    })

    const user = await userRepo.findUserById(id.toString())

    expect(res).toBeNull()
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('student')
  })
})
