import { describe, expect, it } from 'vitest'

import { makeCheckpoint } from '@/test/fixtures'

import { decodePolyline, positionAt } from './geo'

describe('decodePolyline', () => {
  it('decodes a Google-encoded polyline into lat/lon pairs', () => {
    expect(decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@')).toEqual([
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ])
  })
})

describe('positionAt', () => {
  const checkpoints = [
    makeCheckpoint({ sequence: 0, lat: 40, lon: -100, eta: '2026-11-26T20:00:00Z' }),
    makeCheckpoint({ sequence: 1, lat: 42, lon: -104, eta: '2026-11-26T22:00:00Z' }),
  ]

  it('interpolates between the checkpoints that bracket the time', () => {
    expect(positionAt(checkpoints, new Date('2026-11-26T21:00:00Z'))).toEqual([41, -102])
  })

  it('returns the exact checkpoint position at its ETA', () => {
    expect(positionAt(checkpoints, new Date('2026-11-26T22:00:00Z'))).toEqual([42, -104])
  })

  it('returns null before departure and after arrival', () => {
    expect(positionAt(checkpoints, new Date('2026-11-26T19:59:00Z'))).toBeNull()
    expect(positionAt(checkpoints, new Date('2026-11-26T22:01:00Z'))).toBeNull()
  })

  it('returns null without checkpoints', () => {
    expect(positionAt([], new Date())).toBeNull()
  })
})
