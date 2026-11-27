import type { ReactNode } from 'react'

import { riskStyle } from '@/constants/risk'
import type { RouteOption } from '@/types/trip'
import { formatDuration, formatMiles } from '@/utils/format'

interface RecommendationNoteProps {
  route: RouteOption
  /** Whether the recommended route is the one currently shown on the map */
  selected?: boolean
  onSelect?: (routeId: number) => void
}

export function RecommendationNote({ route, selected = true, onSelect }: RecommendationNoteProps) {
  const blocked = route.max_risk?.key === 'no_travel'
  const maxRisk = riskStyle(route.max_risk?.key ?? null)
  const unverified = route.unknown_miles ?? 0

  return (
    <section aria-label="Recommendation" className="space-y-3 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Recommended route</h2>
        <span className="text-xs font-medium text-green-700">Best option</span>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xl font-bold">{route.name}</p>
        {!selected && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(route.id)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Show on map
          </button>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Fact label="Travel time" value={formatDuration(route.duration_s)} />
        <Fact label="Distance" value={formatMiles(route.distance_mi)} />
        <Fact
          label="Maximum risk"
          value={<span style={{ color: maxRisk.color }}>{maxRisk.label}</span>}
        />
        <Fact
          label="Forecast coverage"
          value={
            <>
              {Math.round(route.forecast_coverage * 100)}%
              {unverified > 0 && (
                <span className="block text-xs font-normal text-amber-700">{formatMiles(unverified)} unverified</span>
              )}
            </>
          }
        />
      </dl>

      <p className="border-t pt-2.5 text-xs leading-snug text-muted-foreground">
        {blocked && 'Every option crosses No Travel conditions; this one is least exposed. '}
        {route.recommendation_reason}
      </p>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
