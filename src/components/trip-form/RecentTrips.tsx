import { memo } from 'react'

import { SidebarSection } from '@/components/common/SidebarSection'
import { Spinner } from '@/components/common/Spinner'
import { cn } from '@/lib/utils'
import { formatShortDateTime, formatWeight } from '@/utils/format'
import type { RecentTrip } from '@/utils/recentTrips'

interface RecentTripsProps {
  trips: RecentTrip[]
  activeTripId: string | null
  loadingTripId: string | null
  error?: string
  onOpen: (id: string) => void
  onClear: () => void
}

export const RecentTrips = memo(function RecentTrips({
  trips,
  activeTripId,
  loadingTripId,
  error,
  onOpen,
  onClear,
}: RecentTripsProps) {
  if (!trips.length) return null

  return (
    <SidebarSection
      title="Recent trips"
      aside={
        <button type="button" onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
      }
    >
      {error && <p className="text-xs text-destructive">{error}</p>}
      <ul className="divide-y rounded-lg border">
        {trips.map((trip) => {
          const active = trip.id === activeTripId
          return (
            <li key={trip.id}>
              <button
                type="button"
                onClick={() => onOpen(trip.id)}
                disabled={loadingTripId !== null}
                aria-current={active || undefined}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/60 disabled:cursor-wait',
                  active && 'bg-muted/60',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium" title={tripTitle(trip)}>
                    {tripTitle(trip)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {formatShortDateTime(trip.departure_at)} · {formatWeight(trip.load_weight_lb)}
                    {trip.recommended_route && ` · ${trip.recommended_route} ★`}
                  </span>
                </span>
                {loadingTripId === trip.id && <Spinner className="size-3.5 shrink-0" />}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-[11px] text-muted-foreground">Saved in this browser only.</p>
    </SidebarSection>
  )
})

// "Chicago, Illinois, United States" -> "Chicago, Illinois" keeps the list readable
const shortPlace = (label: string) => label.split(',').slice(0, 2).join(',').trim()
const tripTitle = (trip: RecentTrip) => `${shortPlace(trip.origin_label)} → ${shortPlace(trip.destination_label)}`
