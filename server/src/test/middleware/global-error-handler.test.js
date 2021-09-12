'use strict'

const { globalErrorHandler } = require('../../middleware')
const mockRes = {
  status: () => {
    return {
      json: mockRes.json
    }
  },
  json: jest.fn()

}

describe('globalErrorHandler', () => {
  it('define', () => {
    expect(globalErrorHandler).toBeDefined()
  })

  it('withOut error', () => {
    const spy = jest.fn()
    globalErrorHandler(null, {}, mockRes, spy)
    expect(spy.mock.calls.length).toBe(1)
    expect(mockRes.json.mock.calls.length).toBe(0)
  })

  it('error simple object', () => {
    const spy = jest.fn()
    globalErrorHandler({ message: 'test', name: 'error' }, {}, mockRes, spy)
    expect(spy.mock.calls.length).toBe(1)
    expect(mockRes.json.mock.calls.length).toBe(1)
    expect(mockRes.json.mock.calls[0]).toEqual([{ message: 'Internal Server Error' }])
  })

  it('error Error', () => {
    const spy = jest.fn()
    globalErrorHandler(new Error('test'), {}, mockRes, spy)
    expect(spy.mock.calls.length).toBe(1)
    expect(mockRes.json.mock.calls[0]).toEqual([{ message: 'Internal Server Error' }])
  })

  it('error Error with status', () => {
    const spy = jest.fn()
    const error = new Error('test')
    error.status = 400
    globalErrorHandler(error, {}, mockRes, spy)
    expect(spy.mock.calls.length).toBe(1)
    expect(mockRes.json.mock.calls[0][0]).toBeDefined()
  })
})
