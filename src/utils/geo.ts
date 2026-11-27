import polyline from '@mapbox/polyline'

import type { LatLngTuple } from '@/types/geo'
import type { Checkpoint } from '@/types/trip'

export const decodePolyline = (encoded: string): LatLngTuple[] => polyline.decode(encoded, 5) as LatLngTuple[]

/** Truck position at `moment`, interpolated between the checkpoints that bracket it. */
export function positionAt(checkpoints: Checkpoint[], moment: Date): LatLngTuple | null {
  const t = moment.getTime()
  const first = checkpoints[0]
  const last = checkpoints[checkpoints.length - 1]
  if (!first || !last || t < new Date(first.eta).getTime() || t > new Date(last.eta).getTime()) return null

  for (let i = 1; i < checkpoints.length; i++) {
    const prev = checkpoints[i - 1]!
    const next = checkpoints[i]!
    const start = new Date(prev.eta).getTime()
    const end = new Date(next.eta).getTime()
    if (t <= end) {
      const f = end === start ? 0 : (t - start) / (end - start)
      return [prev.lat + (next.lat - prev.lat) * f, prev.lon + (next.lon - prev.lon) * f]
    }
  }
  return [last.lat, last.lon]
}
