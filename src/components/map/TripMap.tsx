import L from 'leaflet'
import { useMemo, type ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'

import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_HIT_TOLERANCE,
  TILE_ATTRIBUTION,
  TILE_MAX_ZOOM,
  TILE_URL,
} from '@/constants/map'

export function TripMap({ children }: { children?: ReactNode }) {
  const renderer = useMemo(() => L.canvas({ tolerance: MAP_HIT_TOLERANCE }), [])

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      maxZoom={TILE_MAX_ZOOM}
      preferCanvas
      renderer={renderer}
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <ZoomControl position="topright" />
      {children}
    </MapContainer>
  )
}
