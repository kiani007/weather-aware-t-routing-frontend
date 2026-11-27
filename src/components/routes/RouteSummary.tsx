import { memo } from 'react'

import { RiskBadge } from '@/components/common/RiskBadge'
import { SidebarSection } from '@/components/common/SidebarSection'
import { Stat } from '@/components/common/Stat'
import { ROUTE_COLORS } from '@/constants/map'
import type { RouteOption } from '@/types/trip'
import { formatDuration, formatMiles, formatShortDateTime } from '@/utils/format'

import { RiskDistributionBar } from './RiskDistributionBar'

export const RouteSummary = memo(function RouteSummary({ route }: { route: RouteOption }) {
  const { risk_miles: miles } = route
  return (
    <SidebarSection title="Selected route" aside={<RiskBadge risk={route.max_risk.key} />}>
      <div className="space-y-3 rounded-lg border p-3">
        <div className="space-y-0.5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: ROUTE_COLORS[route.index] }} />
            {route.name}
            {route.is_recommended && <span className="text-xs font-normal text-muted-foreground">★</span>}
          </p>
          {route.summary && <p className="truncate text-xs text-muted-foreground">via {route.summary}</p>}
        </div>
        <dl className="grid grid-cols-3 gap-2">
          <Stat label="Distance" value={formatMiles(route.distance_mi)} />
          <Stat label="Drive time" value={formatDuration(route.duration_s)} />
          <Stat label="ETA" value={formatShortDateTime(route.arrival_at)} />
        </dl>
        <div className="space-y-1.5">
          <RiskDistributionBar riskMiles={miles} />
          <div className="flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
            <span>Severe+ {formatMiles(miles.severe + miles.no_travel)}</span>
            <span>High {formatMiles(miles.high)}</span>
            <span>Avg risk {route.average_risk.toFixed(2)}</span>
            {route.forecast_coverage < 1 && <span>Forecast {Math.round(route.forecast_coverage * 100)}%</span>}
          </div>
        </div>
      </div>
    </SidebarSection>
  )
})
