import { useState } from 'react'

import type { Trip } from '@/types/trip'
import { formatShortDateTime } from '@/utils/format'

/**
 * Shown for a reopened trip whose departure has passed: its risk is a record, not a live forecast.
 * The current time is read once on mount, so render it with key={trip.id}.
 */
export function PastTripNote({ trip }: { trip: Trip }) {
  const [now] = useState(Date.now)
  if (new Date(trip.departure_at).getTime() >= now) return null
  return (
    <p role="note" className="rounded-md bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-800">
      This trip departed {formatShortDateTime(trip.departure_at)}. Routes and risk show the forecast from when it was
      planned ({formatShortDateTime(trip.created_at)}). Plan it again for current conditions.
    </p>
  )
}
