'use strict'

const RequestDTO = require('../../models/request-dto')

const mockGETQuery = {
  method: 'GET',
  query: { id: ['611e6bbffc13ae5b8d000000', '611e6bbffc13ae5b8d000004'], role: 'teacher' },
  params: { },
  body: {}
}

describe('User repo test', () => {
  it('define', () => {
    expect(RequestDTO).toBeDefined()
  })

  it('class', () => {
    expect(typeof RequestDTO.constructor).toBe('function')
  })

  it('constructor test fn', () => {
    const dto = new RequestDTO(mockGETQuery)

    expect(dto.hasQuery).toBeTruthy()
    expect(dto.hasParams).toBeFalsy()
    expect(dto.hasBody).toBeFalsy()
    expect(dto.method).toBe('GET')
    expect(dto.query).toStrictEqual(mockGETQuery.query)
    expect(dto.params).toStrictEqual(mockGETQuery.params)
    expect(dto.body).toStrictEqual(mockGETQuery.body)
  })
})
