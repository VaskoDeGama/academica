'use strict'

const isEmpty = require('./../../utils/is-empty')

describe('IsEmpty', () => {
  it('define', () => {
    expect(isEmpty).toBeDefined()
  })
  it('isFunction', () => {
    expect(typeof isEmpty).toBe('function')
  })
  it('true if null', () => {
    expect(isEmpty(null)).toBeTruthy()
  })
  it('true if []', () => {
    expect(isEmpty([])).toBeTruthy()
  })
  it('true if {}', () => {
    expect(isEmpty({})).toBeTruthy()
  })
  it('true if new Map()', () => {
    expect(isEmpty(new Map())).toBeTruthy()
  })
  it('true if new Set()', () => {
    expect(isEmpty(new Set())).toBeTruthy()
  })
  it('true if 2', () => {
    expect(isEmpty(2)).toBeTruthy()
  })
  it('false if {a: ""}', () => {
    expect(isEmpty({ a: '' })).toBeFalsy()
  })
  it('false if [1]', () => {
    expect(isEmpty([1])).toBeFalsy()
  })
  it('false if new Map(a: {})', () => {
    const map = new Map()
    map.set(1, {})
    expect(isEmpty(map)).toBeFalsy()
  })
  it('false if new Set(1,2,3)', () => {
    const set = new Set([1, 2, 3])
    expect(isEmpty(set)).toBeFalsy()
  })
  it('undefined', () => {
    const set = undefined
    expect(isEmpty(set)).toBeTruthy()
  })
  it('not empty object', () => {
    const set = { a: {} }
    expect(isEmpty(set)).toBeFalsy()
  })
})
