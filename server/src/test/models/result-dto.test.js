'use strict'

const ResultDTO = require('../../models/result-dto')

describe('ResultDTO', () => {
  it('define', () => {
    expect(ResultDTO).toBeDefined()
  })

  it('constructor', () => {
    const resDTO = new ResultDTO()
    expect(resDTO.reqId).toBe('test')
  })

  it('reqId', () => {
    const resDTO = new ResultDTO({ reqId: 'test reqId' })
    expect(resDTO.reqId).toBe('test reqId')
  })

  it('status', () => {
    const resDTO = new ResultDTO({ })
    resDTO.status = 200
    expect(resDTO._status).toBe(200)
    expect(resDTO.status).toBe(200)
  })

  it('data', () => {
    const resDTO = new ResultDTO({ })
    const testData = { data: 'test' }
    resDTO.data = testData
    expect(resDTO._status).toBe(200)
    expect(resDTO.status).toBe(200)
    expect(resDTO.data).toEqual(testData)
  })

  it('add cookie', () => {
    const resDTO = new ResultDTO({ })
    const res = resDTO.addCookie('token', 'test token', { httpOnly: true })
    expect(resDTO.cookies.length).toBe(1)
    expect(resDTO.cookies[0]).toEqual({ name: 'token', value: 'test token', options: { httpOnly: true } })
    expect(res).toStrictEqual(resDTO)
  })

  it('add cookie without opt', () => {
    const resDTO = new ResultDTO({ })
    const res = resDTO.addCookie('token', 'test token')
    expect(resDTO.cookies.length).toBe(1)
    expect(resDTO.cookies[0]).toEqual({ name: 'token', value: 'test token', options: { } })
    expect(res).toStrictEqual(resDTO)
  })

  it('add error', () => {
    const resDTO = new ResultDTO({ })
    const res = resDTO.addError('some string', 400, 'CustomType')
    expect(res).toEqual(resDTO)
    expect(resDTO._errors.length).toBe(1)
    expect(resDTO._errors[0]).toEqual({
      error: {
        message: 'some string',
        status: 400,
        type: 'CustomType'
      },
      message: 'some string',
      type: 'CustomType'
    })
  })

  it('add  object error', () => {
    const resDTO = new ResultDTO({ })
    const errOne = {
      code: 502,
      msg: 'Vary bad msg'
    }
    const res = resDTO.addError(errOne)
    expect(res).toEqual(resDTO)
    expect(resDTO._errors.length).toBe(1)
    expect(resDTO._errors[0]).toEqual({
      error: errOne,
      message: 'Vary bad msg',
      type: 'Error'
    })

    expect(resDTO.status).toBe(502)
  })

  it('add array of errors', () => {
    const resDTO = new ResultDTO({ })
    const errOne = new Error('test error 1')
    errOne.code = 400
    const errTwo = new Error('test error 2')
    const errThree = new TypeError('test error 3')
    errThree.code = 500
    const res = resDTO.addError([errOne, errTwo, errThree])
    expect(res).toEqual(resDTO)
    expect(resDTO._errors.length).toBe(3)
    expect(resDTO._errors[0]).toEqual({
      error: errOne,
      message: 'test error 1',
      type: 'Error'
    })
    expect(resDTO._errors[1]).toEqual({
      error: errTwo,
      message: 'test error 2',
      type: 'Error'
    })
    expect(resDTO._errors[2]).toEqual({
      error: errThree,
      message: 'test error 3',
      type: 'TypeError'
    })
    expect(resDTO.status).toBe(400)
  })

  it('to json ok', () => {
    const resDTO = new ResultDTO({ })
    const testData = { test: true }
    resDTO.data = testData
    expect(resDTO.toJSON()).toEqual({ reqId: 'test', success: true, status: 200, data: testData })
  })

  it('to json error', () => {
    const resDTO = new ResultDTO({ })
    const testData = new Error('test')
    resDTO.addError(testData)
    expect(resDTO.toJSON()).toEqual({ reqId: 'test', success: false, status: 500, errors: [{ error: testData, message: 'test', type: 'Error' }] })
  })

  it('production', () => {
    process.env.PRODUCTION = true
    const resDTO = new ResultDTO({ })
    const testData = new Error('test')
    resDTO.addError(testData)
    expect(resDTO.toJSON()).toEqual({ reqId: 'test', success: false, status: 500, errors: [{ message: 'test', type: 'Error' }] })
    process.env.PRODUCTION = false
  })
})
