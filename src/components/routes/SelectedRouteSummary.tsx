import { RiskBadge } from '@/components/common/RiskBadge'
import { ROUTE_COLORS } from '@/constants/map'
import type { RouteOption } from '@/types/trip'
import { formatDuration, formatMiles } from '@/utils/format'

/** One-line summary of the selected route, for the collapsed mobile panel. */
export function SelectedRouteSummary({ route }: { route: RouteOption }) {
  return (
    <>
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: ROUTE_COLORS[route.index] }} />
      <span className="min-w-0 flex-1 truncate text-sm">
        <span className="font-semibold">{route.name}</span>
        {route.is_recommended && <span aria-label="recommended"> ★</span>}
        <span className="text-muted-foreground">
          {' '}
          · {formatDuration(route.duration_s)} · {formatMiles(route.distance_mi)}
        </span>
      </span>
      <RiskBadge risk={route.max_risk.key} />
    </>
  )
}
