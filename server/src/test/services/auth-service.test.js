'use strict'
const { mockUsers } = require('../models/mock-users')
const { User, Token } = require('../../models')
const { AuthService } = require('../../services')
const { MongoRepository } = require('../../repositories')
const { MongoMemoryServer } = require('mongodb-memory-server')
const DataBase = require('./../../configs/database')
const config = require('config')
const jwt = require('jsonwebtoken')

const userRepository = new MongoRepository(User)
const tokenRepository = new MongoRepository(Token)

const baseMockRequestDTO = {
  reqId: 'TestID',
  hasBody: false,
  hasQuery: false,
  hasParams: false,
  query: {},
  params: {},
  body: {},
  method: 'GET',
  ipAddress: '127.0.0.1'
}

describe('AuthService', () => {
  const authService = new AuthService(userRepository, tokenRepository)
  let mongod = null
  let db = null
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const url = mongod.getUri()
    db = new DataBase({ url, name: config.get('db').name })
    await db.connect()

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

    console.log(resultDTO)
    expect(resultDTO.success).toBeFalsy()
    expect(resultDTO.status).toBe(403)
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
})
