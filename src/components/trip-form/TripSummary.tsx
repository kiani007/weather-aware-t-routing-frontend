import { History, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Trip } from '@/types/trip'
import { formatShortDateTime, formatWeight } from '@/utils/format'

interface TripSummaryProps {
  trip: Trip
  onEdit: () => void
  /** Shown only when there are recent trips to go back to */
  onShowRecent?: () => void
}

/** One-line recap of the planned trip, shown instead of the form until the user edits it. */
export function TripSummary({ trip, onEdit, onShowRecent }: TripSummaryProps) {
  return (
    <section aria-label="Planned trip" className="flex items-start justify-between gap-2">
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium" title={`${trip.origin_label} → ${trip.destination_label}`}>
          {trip.origin_label} → {trip.destination_label}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatShortDateTime(trip.departure_at)} · {formatWeight(trip.load_weight_lb)} · every{' '}
          {trip.sample_interval_mi} mi
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        {onShowRecent && (
          <Button type="button" variant="outline" size="xs" onClick={onShowRecent}>
            <History />
            Recent
          </Button>
        )}
        <Button type="button" variant="outline" size="xs" onClick={onEdit}>
          <Pencil />
          Edit
        </Button>
      </div>
    </section>
  )
}
