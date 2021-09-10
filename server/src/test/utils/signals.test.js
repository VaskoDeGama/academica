'use strict'

const { init } = require('../../utils/signals')

describe('signals', () => {
  beforeEach(() => {
    jest.clearAllMocks() // This is not clearing the invocationCallOrder
  })

  it('init', () => {
    const result = init(() => {})
    expect(typeof result).toBe('function')
  })
  it('exit code 0', async () => {
    let exitCode = null
    jest.spyOn(process, 'exit').mockImplementation((num) => { exitCode = num })
    const cb = jest.fn().mockImplementation(() => true)
    const result = init(cb)

    await result()
    expect(cb.mock.results[0].value).toBeTruthy()
    expect(exitCode).toEqual(0)
  })
  it('exit code i', async () => {
    let exitCode = null
    jest.spyOn(process, 'exit').mockImplementation((num) => { exitCode = num })
    const cb = jest.fn().mockImplementation(() => {
      throw new Error('test error')
    })
    const result = init(cb)

    await result()
    expect(cb.mock.results[0].type).toBe('throw')
    expect(exitCode).toEqual(1)
  })
})
