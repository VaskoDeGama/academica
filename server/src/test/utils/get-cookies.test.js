'use strict'

const getCookies = require('../../utils/get-cookies')

describe('Get cookies', () => {
  it('is define', () => {
    expect(getCookies).toBeDefined()
  })

  it('no cookies', () => {
    const resp = {
      headers: {
      }
    }
    expect(getCookies(resp)).toEqual({})
  })

  it('simple cookies', () => {
    const resp = {
      headers: {
        'set-cookie': ['__Secure-ID=123; Secure; Domain=example.com']
      }
    }
    expect(getCookies(resp)).toEqual({
      '__Secure-ID': {
        value: '123'
      }
    })
  })

  it('simple cookies 2', () => {
    const resp = {
      headers: {
        'set-cookie': ['foo=bar; Max-Age=1000; Domain=.example.com; Path=/; Expires=Tue, 01 Jul 2025 10:01:11 GMT; HttpOnly; Secure']
      }
    }
    expect(getCookies(resp)).toEqual({
      foo: {
        value: 'bar'
      }
    })
  })
})
