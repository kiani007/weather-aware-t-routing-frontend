import { memo, type ReactNode } from 'react'

import { RiskLabel } from '@/components/common/RiskLabel'
import { ROUTE_COLORS } from '@/constants/map'
import { cn } from '@/lib/utils'
import type { RouteOption } from '@/types/trip'
import { formatDuration, formatMiles, formatShortDateTime, routeLetter } from '@/utils/format'

import { RiskDistributionBar } from './RiskDistributionBar'

interface RouteComparisonProps {
  routes: RouteOption[]
  selectedRouteId: number | null
  onSelect: (routeId: number) => void
}

interface Row {
  label: string
  render: (route: RouteOption) => ReactNode
  // Lower is better; the best route's value in this row is bolded
  score?: (route: RouteOption) => number
}

const severeMiles = (route: RouteOption) => route.risk_miles.severe + route.risk_miles.no_travel
// Older API responses have no unknown_miles field
const unknownMiles = (route: RouteOption) => route.unknown_miles ?? 0

const ROWS: Row[] = [
  { label: 'Distance', render: (r) => formatMiles(r.distance_mi), score: (r) => r.distance_mi },
  { label: 'Drive time', render: (r) => formatDuration(r.duration_s), score: (r) => r.duration_s },
  { label: 'ETA', render: (r) => formatShortDateTime(r.arrival_at) },
  { label: 'Max risk', render: (r) => <RiskLabel risk={r.max_risk.key} />, score: (r) => r.max_risk.value },
  { label: 'Severe+', render: (r) => formatMiles(severeMiles(r)), score: severeMiles },
  // Same order as the backend ranking: unverified weather counts right after Severe
  { label: 'Unverified', render: (r) => formatMiles(unknownMiles(r)), score: unknownMiles },
  { label: 'High', render: (r) => formatMiles(r.risk_miles.high), score: (r) => r.risk_miles.high },
  { label: 'Avg risk', render: (r) => r.average_risk.toFixed(2), score: (r) => r.average_risk },
  {
    label: 'Risk mix',
    render: (r) => <RiskDistributionBar riskMiles={r.risk_miles} unknownMiles={unknownMiles(r)} />,
  },
]

export const RouteComparison = memo(function RouteComparison({
  routes,
  selectedRouteId,
  onSelect,
}: RouteComparisonProps) {
  return (
    // Titled by the surrounding tab ("Compare"), so no heading of its own
    <section aria-label="Compare routes" className="space-y-2.5">
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-xs">
          <colgroup>
            <col className="w-[72px]" />
          </colgroup>
          <thead>
            <tr>
              <th className="bg-muted/40" aria-label="Metric" />
              {routes.map((route) => {
                const selected = route.id === selectedRouteId
                return (
                  <th key={route.id} className="p-0">
                    <button
                      type="button"
                      aria-pressed={selected}
                      title={route.is_recommended ? `Recommended. ${route.recommendation_reason}` : route.name}
                      onClick={() => onSelect(route.id)}
                      className={cn(
                        'flex w-full items-center justify-center gap-1.5 border-b-2 px-1 py-2 font-semibold transition-colors',
                        selected ? 'bg-background' : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted',
                      )}
                      style={selected ? { borderBottomColor: ROUTE_COLORS[route.index] } : undefined}
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: ROUTE_COLORS[route.index] }} />
                      {routeLetter(route.name)}
                      {route.is_recommended && <span aria-label="recommended">★</span>}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const best = row.score && bestScore(routes, row.score)
              return (
                <tr key={row.label} className="border-t first:border-t-0">
                  <th scope="row" className="px-2 py-1.5 text-left font-normal text-muted-foreground">
                    {row.label}
                  </th>
                  {routes.map((route) => {
                    const isBest = row.score !== undefined && best != null && row.score(route) === best
                    return (
                      <td
                        key={route.id}
                        onClick={() => onSelect(route.id)}
                        className={cn(
                          'cursor-pointer px-1.5 py-1.5 text-center tabular-nums',
                          route.id === selectedRouteId && 'bg-muted/50',
                          isBest && 'font-semibold',
                        )}
                      >
                        {row.render(route)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">Bold marks the best value in each row. Click a column to select it.</p>
    </section>
  )
})

// Null when every route ties, so a row of equal values isn't all bold
function bestScore(routes: RouteOption[], score: (route: RouteOption) => number) {
  const scores = routes.map(score)
  const best = Math.min(...scores)
  return scores.every((value) => value === best) ? null : best
}
