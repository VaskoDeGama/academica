'use strict'

const validator = require('../../utils/validator')
const { RequestDTO } = require('../../models')
const { userScheme } = require('../../models/user')

describe('validator', () => {
  it('define', () => {
    expect(validator).toBeDefined()
  })

  it('function', () => {
    expect(typeof validator).toBe('function')
  })

  it('params id', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      params: { id: '611d0b5a9f364d1f002aa8af' }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeFalsy()
  })

  it('params id not valid', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      params: { id: '611d0b5a9f364d1f002aa8a' }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Bad ID')
  })

  it('query id', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      query: { id: '611d0b5a9f364d1f002aa8af' }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeFalsy()
  })

  it('query id not valid', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      query: { id: '611d0b5a9f364d1002aa8af' }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Bad ID')
  })

  it('query id array valid', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      query: { id: ['611d0b5a9f364d1002aa8af', '611d0b5a9f364d1002aa8af'] }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Bad ID')
  })

  it('query id array not valid', async () => {
    const requestDTO = new RequestDTO({
      method: 'GET',
      query: { id: ['611d0b5a9f364d1002aa8af', '61gd0b5a9f364d1002aa8af'] }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Bad ID')
  })

  it('body post valid', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '12314124124214',
        firstName: 'test',
        lastName: 'testtest',
        balance: 1213.333,
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeFalsy()
  })

  it('body post wrong Username', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniq__Username',
        password: '12314124124214',
        firstName: 'test',
        lastName: 'testtest',
        balance: 1213.333,
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Username must contain only letters and numbers')
    expect(result.errors[0].field).toBe('username')
  })
  it('body post wrong Password', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2',
        firstName: 'test',
        lastName: 'testtest',
        balance: 1213.333,
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Password must be longer then 8 characters')
    expect(result.errors[0].field).toBe('password')
  })

  it('body post wrong firstName and lastname', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2123123123123',
        firstName: 't',
        lastName: 't',
        balance: 1213.333,
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(2)
    expect(result.errors[0].message).toBe('FirstName must be longer than 2 characters')
    expect(result.errors[1].message).toBe('LastName must be longer than 2 characters')
    expect(result.errors[0].field).toBe('firstName')
    expect(result.errors[1].field).toBe('lastName')
  })

  it('body post wrong balance', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2123123123123',
        firstName: 'te',
        lastName: 'te',
        balance: 'dasda3',
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Balance must be numeric')
    expect(result.errors[0].field).toBe('balance')
  })

  it('body post wrong skype', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2123123123123',
        firstName: 'te',
        lastName: 'te',
        balance: '213',
        skype: 'sda',
        email: 'vasr123123_212eqw@gmail.com',
        role: 'teacher'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Skype must be longer than 6 characters')
    expect(result.errors[0].field).toBe('skype')
  })

  it('body post wrong role', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2123123123123',
        firstName: 'te',
        lastName: 'te',
        balance: '123123',
        skype: 'sdasdasd',
        email: 'vasr123123_212eqw@gmail.com',
        role: ''
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Field role should be one of "admin, student, teacher"')
    expect(result.errors[0].field).toBe('role')
  })

  it('body post wrong email', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        username: 'uniqUsername',
        password: '2123123123123',
        firstName: 'te',
        lastName: 'te',
        balance: '123123',
        skype: 'sdasdasd',
        email: 'vasr123123_212',
        role: 'admin'
      }
    })

    const result = validator(requestDTO, userScheme)
    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].message).toBe('Wrong Email')
    expect(result.errors[0].field).toBe('email')
  })

  it('body post wrong no require fields', async () => {
    const requestDTO = new RequestDTO({
      method: 'POST',
      body: {
        firstName: 'te',
        lastName: 'te',
        balance: '123123',
        skype: 'sdasdasd',
        email: 'vasr123123_212@kek.ru',
        role: 'admin'
      }
    })

    const result = validator(requestDTO, userScheme)

    expect(result.hasErrors).toBeTruthy()
    expect(Array.isArray(result.errors)).toBeTruthy()
    expect(result.errors.length).toBe(2)
    expect(result.errors[0].message).toBe('Field username is required!')
    expect(result.errors[1].message).toBe('Field password is required!')
    expect(result.errors[0].field).toBe('username')
    expect(result.errors[1].field).toBe('password')
  })

  it('put wrong fileds', async () => {
    const requestDTO = new RequestDTO({
      method: 'PUT',
      body: {
        balance: '12312asdasd',
        skype: 'sdasd',
        role: 'master'
      }
    })

    const result = validator(requestDTO, userScheme)

    expect(result.hasErrors).toBeTruthy()
    expect(result.errors.length).toBe(3)
  })
})
