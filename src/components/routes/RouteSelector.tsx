import { memo } from 'react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ROUTE_COLORS } from '@/constants/map'
import type { RouteOption } from '@/types/trip'
import { formatDuration, routeLetter } from '@/utils/format'

interface RouteSelectorProps {
  routes: RouteOption[]
  selectedRouteId: number | null
  onSelect: (routeId: number) => void
}

export const RouteSelector = memo(function RouteSelector({ routes, selectedRouteId, onSelect }: RouteSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      aria-label="Select route"
      className="pointer-events-auto rounded-lg bg-background shadow-sm"
      value={selectedRouteId == null ? '' : String(selectedRouteId)}
      onValueChange={(next) => next && onSelect(Number(next))}
    >
      {routes.map((route) => (
        <ToggleGroupItem
          key={route.id}
          value={String(route.id)}
          className="gap-1.5 px-3 text-xs data-[state=on]:font-semibold"
          title={route.is_recommended ? `Recommended. ${route.recommendation_reason}` : route.name}
        >
          <span className="size-2 rounded-full" style={{ backgroundColor: ROUTE_COLORS[route.index] }} />
          {routeLetter(route.name)}
          {route.is_recommended && <span aria-label="recommended">★</span>}
          <span className="font-normal text-muted-foreground">{formatDuration(route.duration_s)}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
})
