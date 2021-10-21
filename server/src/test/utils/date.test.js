'use strict'

const { getDay, setTime } = require('../../utils/date')
describe('date', () => {
  it('getDay', async () => {
    const timestamp = 1634217986928 // 14.10.2021 16:26:26
    const day = getDay(timestamp)
    expect(day.getTime()).toBe(1634158800000) // 14.10.2021 00:00:00
  })
  it('setTime', async () => {
    const timestamp = 1634217986928 // 14.10.2021 16:26:26
    const day = setTime(timestamp, 10, 24)
    expect(day).toBe(1634196240000) // 14.10.2021 10:24:00
  })
  it('setTime bad hours', async () => {
    const timestamp = 1634217986928 // 14.10.2021 16:26:26
    const day = setTime(timestamp, 66, 24)
    expect(day).toBe(1634158800000) // 14.10.2021 00:24:00
  })
  it('setTime bad minutes', async () => {
    const timestamp = 1634217986928 // 14.10.2021 16:26:26
    const day = setTime(timestamp, 10, 1313)
    expect(day).toBe(1634273580000) // 14.10.2021 00:24:00
  })
})
