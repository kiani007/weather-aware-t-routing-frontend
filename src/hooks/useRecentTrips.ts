import { useCallback, useState } from 'react'

import type { Trip } from '@/types/trip'
import { addRecentTrip, readRecentTrips, summarizeTrip, writeRecentTrips, type RecentTrip } from '@/utils/recentTrips'

/** Trips planned in this browser, newest first. Stored locally; no accounts involved. */
export function useRecentTrips() {
  const [trips, setTrips] = useState<RecentTrip[]>(readRecentTrips)

  const update = useCallback((next: (current: RecentTrip[]) => RecentTrip[]) => {
    setTrips((current) => {
      const updated = next(current)
      writeRecentTrips(updated)
      return updated
    })
  }, [])

  const remember = useCallback((trip: Trip) => update((current) => addRecentTrip(current, summarizeTrip(trip))), [update])
  const forget = useCallback((id: string) => update((current) => current.filter((trip) => trip.id !== id)), [update])
  const clear = useCallback(() => update(() => []), [update])

  return { trips, remember, forget, clear }
}
