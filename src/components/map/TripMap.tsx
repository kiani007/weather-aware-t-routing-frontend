import type { ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'

import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from '@/constants/map'

export function TripMap({ children }: { children?: ReactNode }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      maxZoom={TILE_MAX_ZOOM}
      preferCanvas
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <ZoomControl position="topright" />
      {children}
    </MapContainer>
  )
}
