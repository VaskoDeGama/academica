'use strict'

const delay = require('../../utils/delay')
describe('signals', () => {
  it('strict', async () => {
    const start = Date.now()
    await delay(1000)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
  })
  it('interval', async () => {
    const start = Date.now()
    await delay(1000, 2000)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
    expect(Date.now() - start).toBeLessThanOrEqual(2000)
  })
})
