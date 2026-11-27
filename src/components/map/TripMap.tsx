import L from 'leaflet'
import { useEffect, useMemo, type ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'

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
      // Fractional zoom lets fitted routes fill narrow phone screens
      zoomSnap={0.25}
      preferCanvas
      renderer={renderer}
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <ZoomControl position="topright" />
      <FollowContainerSize />
      {children}
    </MapContainer>
  )
}

// Leaflet only listens to window resizes; the mobile panel changes the map's height directly
function FollowContainerSize() {
  const map = useMap()
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])
  return null
}
