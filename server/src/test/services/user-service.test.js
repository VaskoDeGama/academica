'use strict'

const userService = require('../../services/user-service')
const MockRepo = require('./mock-repo')

describe('User repo test', () => {
  let service = null
  beforeAll(async () => {
    service = userService
    service.repo = new MockRepo([], {})
  })

  it('findById', async () => {

  })
})
