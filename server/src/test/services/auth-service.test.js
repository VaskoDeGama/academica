'use strict'
const { mockUsers } = require('../models/mock-users')
const { User, Token } = require('../../models')
const { AuthService } = require('../../services')
const { MongoRepository } = require('../../repositories')
const { MongoMemoryServer } = require('mongodb-memory-server')
const DataBase = require('./../../configs/database')
const config = require('config')
const jwt = require('jsonwebtoken')
const { mockTokens } = require('../models/mock-tokens')
const { appLogger } = require('../../utils/logger')
const { DiContainer } = require('../../ioc')
const Types = require('../../models/types')

const userRepository = new MongoRepository(User)
const tokenRepository = new MongoRepository(Token)

const ioc = new DiContainer()

ioc.register(Types.cache, {
  set: () => {}
})

const baseMockRequestDTO = {
  reqId: 'TestID',
  hasBody: false,
  hasQuery: false,
  hasParams: false,
  query: {},
  params: {},
  body: {},
  method: 'GET',
  ipAddress: '127.0.0.1',
  cookies: [],
  ioc
}

describe('AuthService', () => {
  const authService = new AuthService(userRepository, tokenRepository)
  let mongod = null
  let db = null
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase(appLogger)
    await db.connect({ url, name: config.get('db').name })

    await User.create(mockUsers)
  })

  afterEach(async () => {
    await db.dropCollections('tokens')
  })

  afterAll(async () => {
    await db.close()
    await mongod.stop()
  })

  it('user not found', async () => {
    const { password } = mockUsers[3]
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: { username: 'bad user', password }
    }
    const mockRequestDTO = Object.assign(baseMockRequestDTO, mockRequest)

    const resultDTO = await authService.authenticate(mockRequestDTO)

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(404)
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].message).toBe('User not found')
  })

  it('bad password', async () => {
    const { username } = mockUsers[3]
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: { username, password: 'bad password' }
    }
    const mockRequestDTO = Object.assign(baseMockRequestDTO, mockRequest)

    const resultDTO = await authService.authenticate(mockRequestDTO)

    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(401)
    expect(resultDTO.errors.length).toBe(1)
    expect(resultDTO.errors[0].message).toBe('The username or password is incorrect')
  })

  it('got jwt', async () => {
    const { username, password, _id, role } = mockUsers[3]
    const mockRequest = {
      hasBody: true,
      method: 'POST',
      body: { username, password }
    }
    const mockRequestDTO = Object.assign(baseMockRequestDTO, mockRequest)

    const resultDTO = await authService.authenticate(mockRequestDTO)

    const { user, token } = resultDTO.data
    const refresh = resultDTO.cookies[0].value
    const decoded = jwt.verify(token, config.server.secret)

    const [refreshTokenRecord] = await Token.find({ token: refresh }).populate('user')
    expect(refreshTokenRecord.user.username).toBe(username)
    expect(user.username).toBe(username)
    expect(decoded.id).toBe(_id.toString())
    expect(decoded.role).toBe(role)
  })

  it('getRefreshToken', async () => {
    await Token.create(mockTokens)

    const { token } = mockTokens[0]
    const result = await authService.getRefreshToken(token)
    expect(result.token).toBe(token)
    expect(result.isActive).toBe(true)
  })

  it('getRefreshToken invalid', async () => {
    await Token.create(mockTokens)

    const { token } = mockTokens[1]
    await expect(authService.getRefreshToken(token))
      .rejects
      .toThrow('Invalid token')
  })

  it('refresh jwt 401', async () => {
    const mockRequestTwo = {
      method: 'GET',
      cookies: {
        refresh: 'bad string'
      }
    }
    const req = Object.assign(baseMockRequestDTO, mockRequestTwo)

    const resultDTO = await authService.refreshToken(req)
    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(401)
  })

  it('refresh jwt', async () => {
    const { username, password } = mockUsers[3]
    const mockRequestOne = {
      hasBody: true,
      method: 'POST',
      body: { username, password }
    }

    const mockRequestDTO = Object.assign(baseMockRequestDTO, mockRequestOne)
    const res = await authService.authenticate(mockRequestDTO)
    const refresh = res.cookies[0].value

    const mockRequestTwo = {
      method: 'GET',
      cookies: {
        refresh
      },
      user: {}
    }
    const req = Object.assign(baseMockRequestDTO, mockRequestTwo)

    const resultDTO = await authService.refreshToken(req)
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.success).toBe(true)
    expect(resultDTO.cookies[0].value).toBeDefined()
    expect(resultDTO.data.token).toBeDefined()
  })

  it('revoke token', async () => {
    await Token.create(mockTokens)
    const mockRequest = {
      method: 'GET',
      cookies: {
        refresh: mockTokens[0].token
      },
      user: {
        role: mockUsers[1].role,
        id: mockUsers[1]._id.toString(),
        jti: 'asdasda',
        ownsToken: token => !!token
      }
    }
    const req = Object.assign(baseMockRequestDTO, mockRequest)

    const resultDTO = await authService.revokeToken(req)
    expect(resultDTO.status).toBe(200)
    expect(resultDTO.success).toBe(true)
    expect(resultDTO.data.message).toBe('Token revoked')
  })

  it('revoke token: no token', async () => {
    await Token.create(mockTokens)
    const mockRequestTwo = {
      method: 'GET',
      cookies: {
      },
      user: {
        role: mockUsers[1].role,
        id: mockUsers[1]._id.toString(),
        ownsToken: token => !!token
      }
    }
    const req = Object.assign(baseMockRequestDTO, mockRequestTwo)

    const resultDTO = await authService.revokeToken(req)
    expect(resultDTO.status).toBe(400)
    expect(resultDTO.success).toBe(false)
    expect(resultDTO.errors[0].message).toBe('Token required')
  })

  it('revoke token: 401', async () => {
    await Token.create(mockTokens)
    const mockRequestTwo = {
      method: 'GET',
      cookies: {
        refresh: mockTokens[0].token
      },
      user: {
        role: mockUsers[1].role,
        id: mockUsers[1]._id.toString(),
        jti: 'asdasda',
        ownsToken: token => false
      }
    }
    const req = Object.assign(baseMockRequestDTO, mockRequestTwo)

    const resultDTO = await authService.revokeToken(req)
    expect(resultDTO.status).toBe(401)
    expect(resultDTO.success).toBe(false)
    expect(resultDTO.errors[0].message).toBe('Unauthorized')
  })
})
