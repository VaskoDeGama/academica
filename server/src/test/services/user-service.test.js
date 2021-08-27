'use strict'
const { UserService } = require('../../services')
const ResultDTO = require('../../models/result-dto')
const { MongoRepository } = require('../../repositories')
const { User } = require('../../models')
const { MongoMemoryServer } = require('mongodb-memory-server')
const DataBase = require('./../../configs/database')
const config = require('config')
const { mockUsers, mockUsersLength } = require('../models/mock-users')

// TODO mockREPO
const userRepository = new MongoRepository(User)

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
  let mongod = null
  let db = null
  const service = new UserService(userRepository)
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

  it('createUser', async () => {
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: { ...mockUsers[0] }
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
        ...mockUsers[0]
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
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: {
        ...mockUsers[0]
      }
    }

    delete mockRequest.body.username

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.createUser(mockRequestDTO)

    expect(resultDTO instanceof ResultDTO).toBeTruthy()
    expect(resultDTO.status).toBe(500)
    expect(resultDTO.success).toBeFalsy()
    expect(Array.isArray(resultDTO.errors)).toBeTruthy()
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].type).toBe('ValidationError')
    expect(resultDTO.errors[0].message).toBe('User validation failed: username: Path `username` is required.')
    expect(resultDTO.errors.length).toBe(1)
  })

  it('findById', async () => {
    const mockRequest = {
      hasParams: true,
      method: 'GET',
      params: {
        id: mockUsers[0]._id.toString()
      }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const mockUser = mockUsers[0]

    await service.userRepositroy.save(mockUser)
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.username).toBe('Username0')
    expect(resultDTO.data.role).toBe('student')
    expect(resultDTO.errors.length).toBe(0)
  })

  it('findById not found', async () => {
    const mockRequest = {
      hasParams: true,
      method: 'GET',
      params: {
        id: mockUsers[0]._id.toString()
      }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const mockUser = mockUsers[1]

    await service.userRepositroy.save(mockUser)
    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].message).toBe('Users not found')
  })

  it('getAll', async () => {
    const mockRequest = {
      method: 'GET',
      params: {},
      query: {},
      body: {}
    }

    await User.create(mockUsers)
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }

    const resultDTO = await service.getUser(mockRequestDTO)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(Array.isArray(resultDTO.data.users)).toBeTruthy()
    expect(resultDTO.data.count).toBe(mockUsersLength)
  })

  it('findByIds', async () => {
    await User.create(mockUsers)
    const requestIds = mockUsers.map(u => u._id.toString()).slice(0, mockUsersLength / 2)

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
  })

  it('findByQuery', async () => {
    await User.create(mockUsers)

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

  it('findByQuery with id', async () => {
    await User.create(mockUsers)

    const mockRequest = {
      hasQuery: true,
      method: 'GET',
      params: {},
      query: { role: 'teacher', id: mockUsers[3]._id.toString() },
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
    const id = mockUsers[4]._id.toString()
    const hasBeforeCreate = !!await service.userRepositroy.findById(id)
    await User.create(mockUsers)

    expect(hasBeforeCreate).toBeFalsy()

    const hasAfterCreate = !!await service.userRepositroy.findById(id)
    expect(hasAfterCreate).toBeTruthy()

    const mockRequest = {
      hasParams: true,
      method: 'DELETE',
      params: { id },
      query: { },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const hasAfterDelete = !!await service.userRepositroy.findById(id)
    expect(hasAfterDelete).toBeFalsy()

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(1)
  })

  it('removeByIds', async () => {
    await User.create(mockUsers)

    const needIds = mockUsers.filter(r => r.role === 'teacher').map(r => r._id.toString())

    const mockRequest = {
      hasQuery: true,
      method: 'DELETE',
      params: { },
      query: { id: needIds },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const documents = await service.userRepositroy.getAll()

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(3)
    expect(documents.length).toBe(7)
  })

  it('removeByQuery', async () => {
    await User.create(mockUsers)

    const mockRequest = {
      hasQuery: true,
      method: 'DELETE',
      params: { },
      query: { role: 'student' },
      body: {}
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)

    const documents = await service.userRepositroy.getAll()

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })

  it('nothing if empty query', async () => {
    await User.create(mockUsers)

    const mockRequest = {
      hasBody: false,
      hasParams: false,
      hasQuery: false,
      method: 'DELETE',
      params: {},
      query: {},
      body: {}
    }

    const beforeDocuments = await service.userRepositroy.getAll()
    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.removeUser(mockRequestDTO)
    const documents = await service.userRepositroy.getAll()

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(documents.length).toBe(mockUsersLength)
    expect(beforeDocuments.length).toBe(mockUsersLength)
  })

  it('update record', async () => {
    await User.create(mockUsers)
    const id = mockUsers[4]._id.toString()
    const mockRequest = {
      hasParams: true,
      hasBody: true,
      method: 'UPDATE',
      params: { id },
      query: {},
      body: { role: 'teacher' }
    }

    const mockRequestDTO = { ...baseMockRequestDTO, ...mockRequest }
    const resultDTO = await service.updateUser(mockRequestDTO)

    const user = await service.userRepositroy.findById(id)

    expect(resultDTO.success).toBeTruthy()
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.data.id).toBe(id.toString())
    expect(user.role).toBe('teacher')
  })
})
