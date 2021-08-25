'use strict'
const UserService = require('../../services/user-service')
const MockRepo = require('./mock-repo')
const ResultDTO = require('../../models/result-dto')
const mongoose = require('mongoose')

const baseMockRequestDTO = {
  reqId: 'TestID',
  hasBody: false,
  hasQuery: false,
  hasParams: false,
  query: {},
  params: {},
  body: {},
  method: 'GET'
}

describe('UserService', () => {
  let service = null
  beforeAll(async () => {
    const repo = new MockRepo([], {
      username: { unique: true, required: true },
      password: {},
      role: { default: 'student' }
    })
    service = new UserService(repo)
  })

  beforeEach(() => {
    service.repo.db = []
  })
  afterEach(() => {
    service.repo.db = []
  })

  it('createUser', async () => {
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: {
        username: 'test1',
        password: 'testPassword'
      }
    }
    const mockRequestDTO = Object.assign(baseMockRequestDTO, mockRequest)

    const resultDTO = await service.createUser(mockRequestDTO)

    expect(resultDTO instanceof ResultDTO).toBeTruthy()
    expect(resultDTO.status).toBe(201)
    expect(typeof resultDTO.data.id).toBe('string')
    expect(resultDTO.data.id.length).toBe(24)
    expect(typeof resultDTO.success).toBeTruthy()
  })

  it('createUserError already exist', async () => {
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: {
        username: 'test1',
        password: 'testPassword'
      }
    }
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }

    await service.createUser(mockRequestDTO)

    const resultDTO = await service.createUser(mockRequestDTO)

    expect(resultDTO instanceof ResultDTO).toBeTruthy()
    expect(resultDTO.status).toBe(409)
    expect(resultDTO.success).toBeFalsy()
    expect(Array.isArray(resultDTO.errors)).toBeTruthy()
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].type).toBe('Custom')
    expect(resultDTO.errors[0].message).toBe('Same user already exists.')
  })

  it('createUserError validation', async () => {
    // TODO update test after implement validation
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: {
        password: 'testPassword'
      }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.createUser(mockRequestDTO)

    expect(resultDTO instanceof ResultDTO).toBeTruthy()
    expect(resultDTO.status).toBe(500)
    expect(resultDTO.success).toBeFalsy()
    expect(Array.isArray(resultDTO.errors)).toBeTruthy()
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].type).toBe('ValidationError')
    expect(resultDTO.errors[0].message).toBe('validation failed: username: Path `username` is required.')
    expect(resultDTO.errors.length).toBe(1)
  })

  it('findById', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockRequest = {
      hasParams: true,
      method: 'GET',
      params: {
        id: id.toString()
      }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const mockUser = {
      id: id.toString(),
      username: 'findById',
      password: 'findByIdpassword'
    }

    await service.repo.saveUser(mockUser)
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.username).toBe('findById')
    expect(resultDTO.data.password).toBe('findByIdpassword')
    expect(resultDTO.data.role).toBe('student')
    expect(resultDTO.errors.length).toBe(0)
  })

  it('findById not found', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockRequest = {
      hasParams: true,
      method: 'GET',
      params: {
        id: id.toString().split('').reverse().join('')
      }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const mockUser = {
      id: id.toString(),
      username: 'findById',
      password: 'findByIdpassword'
    }

    await service.repo.saveUser(mockUser)
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].message).toBe('Users not found')
  })

  it('getAll', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await service.repo.saveUser({
        username: `username${i}`,
        password: `password${i}`
      })
    }
    const mockRequest = {
      method: 'GET',
      params: {},
      query: {},
      body: {}
    }
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }

    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(Array.isArray(resultDTO.data.users)).toBeTruthy()
    expect(resultDTO.data.count).toBe(length)
    expect(resultDTO.errors.length).toBe(0)
  })

  it('findManyById', async () => {
    const length = 10
    const ids = []
    for (let i = 0; i < length; i += 1) {
      const id = new mongoose.Types.ObjectId()
      ids.push(id.toString())
      await service.repo.saveUser({
        id: id,
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const requestIds = ids.slice(0, length / 2)

    const mockRequest = {
      hasQuery: true,
      method: 'GET',
      params: {},
      query: { id: requestIds },
      body: {}
    }
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(Array.isArray(resultDTO.data.users)).toBeTruthy()
    expect(resultDTO.data.count).toBe(requestIds.length)
    expect(resultDTO.data.users.every(user => requestIds.includes(user.id))).toBeTruthy()
    expect(resultDTO.errors.length).toBe(0)
  })

  it('findManyByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await service.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await service.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      hasQuery: true,
      method: 'GET',
      params: {},
      query: { role: 'teacher' },
      body: {}
    }
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }

    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.count).toBe(3)
    expect(resultDTO.data.users.length).toBe(3)
    expect(resultDTO.data.users.every(user => mockRequest.query.role === user.role)).toBeTruthy()
  })

  it('findManyByQuery with id', async () => {
    const length = 10
    let needId = ''
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await service.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })

        if (i === 4) {
          needId = id.toString()
        }
      } else {
        await service.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      hasQuery: true,
      method: 'GET',
      params: {},
      query: { role: 'teacher', id: needId },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.count).toBe(1)
    expect(resultDTO.data.users.length).toBe(1)
    expect(resultDTO.data.users.every(user => mockRequest.query.id === user.id)).toBeTruthy()
  })

  it('removeById', async () => {
    const id = new mongoose.Types.ObjectId()
    const hasBeforeCreate = !!await service.repo.findUserById(id.toString())

    expect(hasBeforeCreate).toBeFalsy()

    await service.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password'
    })

    const hasAfterCreate = !!await service.repo.findUserById(id.toString())
    expect(hasAfterCreate).toBeTruthy()

    const mockRequest = {
      hasParams: true,
      method: 'DELETE',
      params: { id: id.toString() },
      query: { },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const hasAfterDelete = !!await service.repo.findUserById(id.toString())
    expect(hasAfterDelete).toBeFalsy()
    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(1)
  })

  it('removeByIds', async () => {
    const length = 10
    const needIds = []
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await service.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })

        needIds.push(id.toString())
      } else {
        await service.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      hasQuery: true,
      method: 'DELETE',
      params: { },
      query: { id: needIds },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const documents = await service.repo.getAllUsers()

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(3)
    expect(documents.length).toBe(7)
  })

  it('removeByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await service.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await service.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      hasQuery: true,
      method: 'DELETE',
      params: { },
      query: { role: 'student' },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const documents = await service.repo.getAllUsers()

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })

  it('nothing if empty query ', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await service.repo.saveUser({
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const mockRequest = {
      hasBody: false,
      hasParams: false,
      hasQuery: false,
      method: 'DELETE',
      params: {},
      query: {},
      body: {}
    }

    const beforeDocuments = await service.repo.getAllUsers()
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)
    const documents = await service.repo.getAllUsers()

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(documents.length).toBe(length)
    expect(beforeDocuments.length).toBe(length)
  })

  it('update record', async () => {
    const id = new mongoose.Types.ObjectId()

    await service.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password',
      role: 'student'
    })

    const mockRequest = {
      hasParams: true,
      hasBody: true,
      method: 'UPDATE',
      params: { id: id.toString() },
      query: {},
      body: { role: 'teacher' }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.updateUser(mockRequestDTO)

    const user = await service.repo.findUserById(id.toString())

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.id).toBe(id.toString())
    expect(user.role).toBe('teacher')
  })

  it('404 if bad id record', async () => {
    const id = new mongoose.Types.ObjectId()

    await service.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password',
      role: 'student'
    })

    const mockRequest = {
      hasParams: true,
      hasBody: true,
      method: 'UPDATE',
      params: { id: 'bad id' },
      query: {},
      body: { role: 'teacher' }
    }
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.updateUser(mockRequestDTO)

    const user = await service.repo.findUserById(id.toString())

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('student')
  })
})
