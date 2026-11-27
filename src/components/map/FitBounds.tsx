import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import type { LatLngTuple } from '@/types/geo'

const FIT_OPTIONS: L.FitBoundsOptions = { paddingTopLeft: [32, 64], paddingBottomRight: [32, 96], maxZoom: 10 }

export function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length) map.fitBounds(L.latLngBounds(points), FIT_OPTIONS)
  }, [points, map])
  return null
}
