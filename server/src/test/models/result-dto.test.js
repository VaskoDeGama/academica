'use strict'

const ResultDTO = require('../../models/result-dto')

const mocqRequstDTO = {
  reqId: 'testReqId',
  method: 'GET',
  query: { id: ['611e6bbffc13ae5b8d000000', '611e6bbffc13ae5b8d000004'], role: 'teacher' },
  params: { },
  body: {},
  hasQuery: true,
  hasParams: false,
  hasBody: false

}

describe('User repo test', () => {
  it('define', () => {
    expect(ResultDTO).toBeDefined()
  })

  it('class', () => {
    expect(typeof ResultDTO.constructor).toBe('function')
  })

  it('constructor test', () => {
    const dto = new ResultDTO(mocqRequstDTO)

    expect(dto.status).toBe(500)
    expect(dto.data).toBe(null)
    expect(Array.isArray(dto.errors)).toBeTruthy()
    expect(dto.reqId).toBe('testReqId')
  })

  it('to json', () => {
    const dto = new ResultDTO()
    const obj = dto.toJSON()

    expect(typeof obj).toBe('object')
    expect(Reflect.has(obj, '_status')).toBeFalsy()
    expect(Reflect.ownKeys(obj)).toStrictEqual(['reqId', 'success', 'status'])
  })

  it('status setter', () => {
    const dto = new ResultDTO()

    expect(dto.status).toBe(500)
    dto.data = 'kek'
    expect(dto.status).toBe(200)
  })

  it('success setter', () => {
    const dto = new ResultDTO()

    expect(dto.success).toBe(false)
    dto.data = 'kek'
    expect(dto.success).toBe(true)
  })

  it('add Error', () => {
    const dto = new ResultDTO()

    expect(dto.status).toBe(500)
    const error = new Error('Not found')
    dto.addError(error, 404)
    expect(dto.success).toBe(false)
    expect(dto.status).toBe(404)
    expect(dto.errors.length).toBe(1)
    expect(dto.errors[0].msg).toBe('Not found')
    expect(dto.errors[0].type).toBe('Error')
    expect(dto.errors[0].error).toStrictEqual(error)
  })
})
