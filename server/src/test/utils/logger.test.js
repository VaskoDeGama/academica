'use strict'

const { httpFormatter } = require('../../utils/logger')

describe('logger', () => {
  it('formatter', () => {
    const result = httpFormatter({}, {}, (x) => x)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toBe('#undefined: :method :url | processed for: NaNms | resStatus: undefined')
  })
})
