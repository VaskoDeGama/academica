'use strict'

const DTO = require('./../../models/DTO')

const mockGETQuery = {
  method: 'GET',
  query: { id: ['611e6bbffc13ae5b8d000000', '611e6bbffc13ae5b8d000004'], role: 'teacher' },
  params: { },
  body: {}
}

describe('User repo test', () => {
  it('define', () => {
    expect(DTO).toBeDefined()
  })

  it('class', () => {
    expect(typeof DTO.constructor).toBe('function')
  })

  it('constructor test', () => {
    const dto = new DTO(mockGETQuery)

    expect(dto.status).toBe(500)
    expect(dto.data).toBe(null)
    expect(Array.isArray(dto.errors)).toBeTruthy()
    expect(typeof dto.request).toBe('object')
    expect(dto.reqId).toBe('test')
  })

  it('prepareRequest fn', () => {
    const dto = new DTO(mockGETQuery)

    expect(dto.request.hasQuery).toBeTruthy()
    expect(dto.request.hasParams).toBeFalsy()
    expect(dto.request.hasBody).toBeFalsy()
    expect(dto.request.method).toBe('GET')
    expect(dto.request.query).toStrictEqual(mockGETQuery.query)
    expect(dto.request.params).toStrictEqual(mockGETQuery.params)
    expect(dto.request.body).toStrictEqual(mockGETQuery.body)
  })

  it('to json', () => {
    const dto = new DTO(mockGETQuery)
    const obj = dto.toJSON()

    expect(typeof obj).toBe('object')
    expect(Reflect.has(obj, '_status')).toBeFalsy()
    expect(Reflect.ownKeys(obj)).toStrictEqual(['reqId', 'success', 'status'])
  })

  it('status setter', () => {
    const dto = new DTO(mockGETQuery)

    expect(dto.status).toBe(500)
    dto.data = 'kek'
    expect(dto.status).toBe(200)
  })

  it('success setter', () => {
    const dto = new DTO(mockGETQuery)

    expect(dto.success).toBe(false)
    dto.data = 'kek'
    expect(dto.success).toBe(true)
  })

  it('add Error', () => {
    const dto = new DTO(mockGETQuery)

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
