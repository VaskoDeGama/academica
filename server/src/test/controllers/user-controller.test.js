'use strict'

const UserController = require('../../controllers/user-controller')
const ResultDTO = require('../../models/result-dto')

const serviceMock = {
  createUser: jest.fn().mockResolvedValue(() => {
    const result = new ResultDTO()
    result.data = {
      id: '612146f2a770a4b1dfe4002e'
    }
    result.status = 201

    return result
  }),
  getUser: jest.fn().mockResolvedValue(() => {
    return new ResultDTO()
  }),
  updateUser: jest.fn().mockResolvedValue(() => {
    return new ResultDTO()
  }),
  removeUser: jest.fn().mockResolvedValue(() => {
    return new ResultDTO()
  })
}

const mockResponse = {
}
const mockRequest = {
  app: { servLog: { error: jest.fn() } },
  query: {},
  params: {},
  body: {},
  method: 'GET'
}

describe('userController', () => {
  beforeAll(() => {
    mockResponse.body = null
    mockResponse.statusCode = null
    mockResponse.status = function (code) {
      this.statusCode = code
      return this
    }
    mockResponse.json = function (obj) {
      this.body = JSON.stringify(obj)
      return this
    }
    mockResponse.toOBJ = function () {
      const result = {
        status: this.statusCode
      }

      if (this.body) {
        result.body = this.body
      }

      return result
    }
  })

  it('createUser', async () => {
    await userController.create(mockRequest, mockResponse)
  })
})
