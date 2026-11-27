import { memo } from 'react'
import { Polyline, Tooltip } from 'react-leaflet'

import { ROUTE_COLORS, ROUTE_LABEL_POSITIONS } from '@/constants/map'
import type { LatLngTuple } from '@/types/geo'
import type { RouteOption } from '@/types/trip'
import { routeLetter } from '@/utils/format'

export interface DecodedRoute {
  route: RouteOption
  path: LatLngTuple[]
}

interface RouteLayersProps {
  routes: DecodedRoute[]
  selectedRouteId: number | null
  onSelect: (routeId: number) => void
}

export const RouteLayers = memo(function RouteLayers({ routes, selectedRouteId, onSelect }: RouteLayersProps) {
  const ordered = [...routes].sort((a, b) => Number(a.route.id === selectedRouteId) - Number(b.route.id === selectedRouteId))

  return ordered.map(({ route, path }) => {
    const selected = route.id === selectedRouteId
    const color = ROUTE_COLORS[route.index] ?? ROUTE_COLORS[0]
    const labelPoint = path[Math.floor(path.length * (ROUTE_LABEL_POSITIONS[route.index] ?? 0.5))]
    return (
      <Polyline
        key={`${route.id}-${selected}`}
        positions={path}
        pathOptions={{ color, weight: selected ? 6 : 2.5, opacity: selected ? 0.95 : 0.35 }}
        eventHandlers={{ click: () => onSelect(route.id) }}
      >
        {labelPoint && (
          <Tooltip permanent direction="center" className="route-label" opacity={selected ? 1 : 0.55}>
            <span style={{ color }} className="font-semibold">
              {routeLetter(route.name)}
            </span>
          </Tooltip>
        )}
      </Polyline>
    )
  })
})
