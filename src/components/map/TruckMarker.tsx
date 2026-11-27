import L from 'leaflet'
import { Marker, Tooltip } from 'react-leaflet'

import type { LatLngTuple } from '@/types/geo'

const TRUCK_ICON = L.divIcon({
  className: '',
  html: '<div class="truck-marker" aria-hidden="true">🚚</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

export function TruckMarker({ position, label }: { position: LatLngTuple | null; label: string }) {
  if (!position) return null
  return (
    <Marker position={position} icon={TRUCK_ICON} zIndexOffset={1000} interactive>
      <Tooltip direction="top" offset={[0, -14]}>
        {label}
      </Tooltip>
    </Marker>
  )
}
