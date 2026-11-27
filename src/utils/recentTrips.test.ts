import { afterEach, describe, expect, it } from 'vitest'

import {
  MAX_RECENT_TRIPS,
  RECENT_TRIPS_KEY,
  addRecentTrip,
  readRecentTrips,
  writeRecentTrips,
  type RecentTrip,
} from './recentTrips'

const trip = (id: string): RecentTrip => ({
  id,
  origin_label: 'Chicago, Illinois, United States',
  destination_label: 'Denver, Colorado, United States',
  departure_at: '2026-11-28T07:00:00Z',
  load_weight_lb: 35_000,
  recommended_route: 'Route A',
  planned_at: '2026-11-28T06:00:00Z',
})

afterEach(() => window.localStorage.clear())

describe('recent trips storage', () => {
  it('puts the newest trip first without duplicates', () => {
    const list = addRecentTrip([trip('a'), trip('b')], trip('b'))
    expect(list.map((t) => t.id)).toEqual(['b', 'a'])
  })

  it(`keeps at most ${MAX_RECENT_TRIPS} trips`, () => {
    let list: RecentTrip[] = []
    for (let i = 0; i < MAX_RECENT_TRIPS + 3; i += 1) list = addRecentTrip(list, trip(String(i)))
    expect(list).toHaveLength(MAX_RECENT_TRIPS)
    expect(list[0]?.id).toBe(String(MAX_RECENT_TRIPS + 2))
  })

  it('round-trips through localStorage', () => {
    writeRecentTrips([trip('a')])
    expect(readRecentTrips()).toEqual([trip('a')])
  })

  it('ignores corrupt or foreign data', () => {
    window.localStorage.setItem(RECENT_TRIPS_KEY, '{not json')
    expect(readRecentTrips()).toEqual([])

    window.localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify([{ id: 1 }, trip('ok')]))
    expect(readRecentTrips().map((t) => t.id)).toEqual(['ok'])
  })
})
