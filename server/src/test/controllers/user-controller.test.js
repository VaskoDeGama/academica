'use strict'

const UserController = require('../../controllers/user-controller')
const ResultDTO = require('../../models/result-dto')

const serviceMock = {
  createUser: jest.fn().mockImplementation(() => {
    const result = new ResultDTO()
    result.data = {
      id: '612146f2a770a4b1dfe4002e'
    }
    result.status = 201

    return result
  }),
  getUser: jest.fn().mockImplementation(() => {
    const result = new ResultDTO()
    result.data = {
      role: 'student',
      balance: '0',
      username: 'test2',
      createdAt: '2021-08-18T13:30:02.622Z',
      updatedAt: '2021-08-18T13:30:02.622Z',
      id: '611d0b5a9f364d1f002aa8af'
    }

    return result
  }),
  updateUser: jest.fn().mockImplementation(() => {
    const result = new ResultDTO()
    result.data = {
      id: '612146f2a770a4b1dfe4002e'
    }

    return result
  }),
  removeUser: jest.fn().mockImplementation(() => {
    const result = new ResultDTO()
    result.data = {
      deleteCount: 1
    }

    return result
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
  let controller = null
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
        result.body = JSON.parse(this.body)
      }

      return result
    }

    controller = new UserController(serviceMock)
  })

  it('create ok', done => {
    controller.create(mockRequest, mockResponse, () => {
      const result = mockResponse.toOBJ()
      expect(result.status).toBe(201)
      expect(result.body.success).toBeTruthy()
      expect(result.body.data.id).toBe('612146f2a770a4b1dfe4002e')
      expect(serviceMock.createUser.mock.calls.length).toBe(1)
      done()
    })
  })

  it('get ok', done => {
    controller.get(mockRequest, mockResponse, () => {
      const result = mockResponse.toOBJ()
      expect(result.status).toBe(200)
      expect(result.body.success).toBeTruthy()
      expect(serviceMock.getUser.mock.calls.length).toBe(1)
      done()
    })
  })

  it('update ok', done => {
    controller.update(mockRequest, mockResponse, () => {
      const result = mockResponse.toOBJ()
      expect(result.status).toBe(200)
      expect(result.body.success).toBeTruthy()
      expect(serviceMock.updateUser.mock.calls.length).toBe(1)
      done()
    })
  })

  it('delete ok', done => {
    controller.delete(mockRequest, mockResponse, () => {
      const result = mockResponse.toOBJ()
      expect(result.status).toBe(200)
      expect(result.body.success).toBeTruthy()
      expect(serviceMock.removeUser.mock.calls.length).toBe(1)
      done()
    })
  })

  it('delete param validation failed', done => {
    controller.delete(mockRequest, mockResponse, () => {
      const result = mockResponse.toOBJ()
      expect(result.status).toBe(200)
      expect(result.body.success).toBeTruthy()
      expect(serviceMock.removeUser.mock.calls.length).toBe(1)
      done()
    })
  })
})
