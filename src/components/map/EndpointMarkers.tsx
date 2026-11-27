import L from 'leaflet'
import { memo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'

import type { Place } from '@/types/geo'

const pin = (label: string, className: string) =>
  L.divIcon({
    className: '',
    html: `<div class="endpoint-pin ${className}">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })

const ORIGIN_ICON = pin('A', 'bg-slate-900')
const DESTINATION_ICON = pin('B', 'bg-emerald-600')

export const EndpointMarkers = memo(function EndpointMarkers({ origin, destination }: { origin: Place; destination: Place }) {
  return (
    <>
      <Marker position={[origin.lat, origin.lon]} icon={ORIGIN_ICON}>
        <Tooltip direction="top" offset={[0, -12]}>
          Origin: {origin.label}
        </Tooltip>
      </Marker>
      <Marker position={[destination.lat, destination.lon]} icon={DESTINATION_ICON}>
        <Tooltip direction="top" offset={[0, -12]}>
          Destination: {destination.label}
        </Tooltip>
      </Marker>
    </>
  )
})
