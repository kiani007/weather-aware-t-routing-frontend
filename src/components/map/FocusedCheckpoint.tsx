import { useEffect } from 'react'
import { CircleMarker, useMap } from 'react-leaflet'

import type { Checkpoint } from '@/types/trip'

export function FocusedCheckpoint({ checkpoint }: { checkpoint: Checkpoint | null }) {
  const map = useMap()
  useEffect(() => {
    if (checkpoint) map.flyTo([checkpoint.lat, checkpoint.lon], Math.max(map.getZoom(), 8), { duration: 0.6 })
  }, [checkpoint, map])

  if (!checkpoint) return null
  return (
    <CircleMarker
      center={[checkpoint.lat, checkpoint.lon]}
      radius={13}
      interactive={false}
      pathOptions={{ color: '#0ea5e9', weight: 3, fillOpacity: 0 }}
    />
  )
}
