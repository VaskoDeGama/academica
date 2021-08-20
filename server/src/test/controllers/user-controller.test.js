'use strict'

const userController = require('../../controllers/user-controller')

const serviceMock = {
  createUser: jest.fn().mockResolvedValue(() => {}),
  getUser: jest.fn().mockResolvedValue(() => {}),
  updateUser: jest.fn().mockResolvedValue(() => {}),
  removeUser: jest.fn().mockResolvedValue(() => {})

}
const mockResponse = {}
const mockRequest = {
  app: { servLog: { error: jest.fn() } }
}

describe('userController', () => {
  it('defined', () => {
    expect(userController).toBeDefined()
  })
})
