import { formatDate } from '../../src/utils'

describe('utils', () => {
  test('formatDate', () => {
    const timestamp = '2018-10-01 10:20'
    const date = new Date(timestamp)
    const fmt = 'yyyy-MM-dd hh:mm'
    expect(formatDate(date, fmt)).toBe(timestamp)
  })
})
