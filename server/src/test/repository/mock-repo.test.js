'use strict'

const MockRepo = require('../services/mock-repo.js')
const mongoose = require('mongoose')

describe('mock repo test', () => {
  let repo = null
  beforeAll(async () => {
    repo = new MockRepo([], {
      username: { unique: true, required: true },
      password: {},
      role: { default: 'student' }
    })
  })

  afterEach(() => {
    repo.db = []
  })

  it('findById', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockUser = {
      id,
      username: 'findById',
      password: 'findByIdpassword'
    }
    await repo.saveUser(mockUser)
    const userFromDb = await repo.findUserById(id.toString())

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.id).toBe(id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('saveUser', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockUser = {
      id,
      username: 'test1',
      password: 'test1password'
    }
    const resp = await repo.saveUser(mockUser)
    const userFromDb = await repo.findUserById(resp.id)

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.id).toBe(id.toString())
    expect(userFromDb.role).toBe('student')
  })

  it('getAll', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await repo.saveUser({
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await repo.getAllUsers()

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length)
  })

  it('findManyById', async () => {
    const length = 10
    const ids = []
    for (let i = 0; i < length; i += 1) {
      const id = new mongoose.Types.ObjectId()
      ids.push(id.toString())
      await repo.saveUser({
        id,
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await repo.findUsersByIds(ids.slice(0, length / 2))

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length / 2)
  })

  it('findManyByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await repo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const usersFromDb = await repo.findUsersByQuery({
      role: 'teacher'
    })

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb[0].role).toBe('teacher')
    expect(usersFromDb.length).toBe(3)
  })

  it('removeById', async () => {
    const id = new mongoose.Types.ObjectId()
    const hasBeforeCreate = !!await repo.findUserById(id.toString())

    expect(hasBeforeCreate).toBeFalsy()

    await repo.saveUser({
      id,
      username: 'username',
      password: 'password'
    })

    const hasAfterCreate = !!await repo.findUserById(id.toString())
    expect(hasAfterCreate).toBeTruthy()
    const res = await repo.removeUserById(id.toString())

    expect(res.deletedCount).toBe(1)

    const hasAfterDelete = !!await repo.findUserById(id.toString())
    expect(hasAfterDelete).toBeFalsy()
  })

  it('removeByIds', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await repo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const res = await repo.removeUsersByQuery({
      role: 'student'
    })

    const documents = await repo.getAllUsers()

    expect(res.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })
})
