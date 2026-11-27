import { describe, expect, it } from 'vitest'

import { formatDuration, formatInches, formatMeasure, formatMiles, formatTime, formatWeekday, routeLetter } from './format'

describe('formatDuration', () => {
  it('shows hours and zero-padded minutes', () => {
    expect(formatDuration(64_080)).toBe('17h 48m')
    expect(formatDuration(3_660)).toBe('1h 01m')
  })

  it('shows only minutes under an hour', () => {
    expect(formatDuration(1_500)).toBe('25m')
  })
})

describe('measurements', () => {
  it('formats miles with at most one decimal', () => {
    expect(formatMiles(1004.44)).toBe('1,004.4 mi')
  })

  it('formats precipitation in inches with a dash for missing data', () => {
    expect(formatInches(0.1)).toBe('0.10"')
    expect(formatInches(null)).toBe('—')
  })

  it('formats a generic measure', () => {
    expect(formatMeasure(37.4, 'mph', 0)).toBe('37 mph')
    expect(formatMeasure(null, 'mph')).toBe('—')
  })
})

describe('dates', () => {
  it('formats checkpoint times and weekdays', () => {
    expect(formatTime('2026-11-26T21:05:00Z')).toBe('9:05 PM')
    expect(formatWeekday('2026-11-26T21:05:00Z')).toBe('Thu')
  })
})

describe('routeLetter', () => {
  it('strips the "Route" prefix', () => {
    expect(routeLetter('Route B')).toBe('B')
  })
})
