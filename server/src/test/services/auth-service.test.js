'use strict'
const UserService = require('../../services/user-service')
const ResultDTO = require('../../models/result-dto')
const { mockUsers } = require('../models/mock-users')
const { userScheme, tokenScheme } = require('../../models')
const { mockTokens } = require('../models/mock-tokens')

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

describe('AuthService', () => {
  beforeAll(async () => {
  })

  beforeEach(() => {
  })

  afterEach(() => {
  })

  it('test', () => {
    expect(1).toBe(1)
  })
})
