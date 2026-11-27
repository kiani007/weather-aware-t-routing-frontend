import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import type { LatLngTuple } from '@/types/geo'

const FIT_OPTIONS: L.FitBoundsOptions = { paddingTopLeft: [32, 64], paddingBottomRight: [32, 96], maxZoom: 10 }

// On mobile the panel shrinks right after planning, which resizes the map. Keep the
// routes framed while that settles, unless the user has started moving the map.
const REFIT_WINDOW_MS = 1500

export function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) return
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, FIT_OPTIONS)

    const fittedAt = Date.now()
    let userMoved = false
    const container = map.getContainer()
    const markMoved = () => {
      userMoved = true
    }
    const refit = () => {
      if (!userMoved && Date.now() - fittedAt < REFIT_WINDOW_MS) map.fitBounds(bounds, { ...FIT_OPTIONS, animate: false })
    }
    container.addEventListener('pointerdown', markMoved)
    container.addEventListener('wheel', markMoved)
    map.on('resize', refit)
    return () => {
      container.removeEventListener('pointerdown', markMoved)
      container.removeEventListener('wheel', markMoved)
      map.off('resize', refit)
    }
  }, [points, map])
  return null
}
