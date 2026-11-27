import { ArrowUpDown } from 'lucide-react'
import { memo, useState, type FormEvent } from 'react'

import { SidebarSection } from '@/components/common/SidebarSection'
import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MAX_DAYS_AHEAD, useTripForm, type TripFormValues } from '@/hooks/useTripForm'
import { SAMPLE_INTERVALS, type SampleInterval, type TripPlanRequest } from '@/types/trip'
import { addDays, toLocalInputValue } from '@/utils/datetime'

import { FormField } from './FormField'
import { PlaceAutocomplete } from './PlaceAutocomplete'

interface TripFormProps {
  onSubmit: (request: TripPlanRequest) => void
  submitting: boolean
  error?: string
  /** Starting values, read once on mount; remount with a new key to reseed */
  initialValues?: Partial<TripFormValues>
}

export const TripForm = memo(function TripForm({ onSubmit, submitting, error, initialValues }: TripFormProps) {
  const { values, errors, setField, swapLocations, toRequest } = useTripForm(initialValues)
  const [bounds] = useState(() => ({
    min: toLocalInputValue(new Date()),
    max: toLocalInputValue(addDays(new Date(), MAX_DAYS_AHEAD)),
  }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const request = toRequest()
    if (request) onSubmit(request)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <SidebarSection
        title="Route"
        aside={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={swapLocations}
            aria-label="Swap origin and destination"
            className="text-muted-foreground"
          >
            <ArrowUpDown />
          </Button>
        }
      >
        <FormField label="Origin" htmlFor="origin" error={errors.origin}>
          <PlaceAutocomplete
            id="origin"
            value={values.origin}
            onChange={(place) => setField('origin', place)}
            placeholder="Enter your origin"
            invalid={Boolean(errors.origin)}
          />
        </FormField>
        <FormField label="Destination" htmlFor="destination" error={errors.destination}>
          <PlaceAutocomplete
            id="destination"
            value={values.destination}
            onChange={(place) => setField('destination', place)}
            placeholder="Enter your destination"
            invalid={Boolean(errors.destination)}
          />
        </FormField>
      </SidebarSection>

      <SidebarSection title="Trip">
        <div className="grid grid-cols-[3fr_2fr] gap-2.5">
          <FormField label="Departure" htmlFor="departure" error={errors.departure}>
            <Input
              id="departure"
              type="datetime-local"
              className="text-xs"
              value={values.departure}
              min={bounds.min}
              max={bounds.max}
              aria-invalid={Boolean(errors.departure)}
              onChange={(event) => setField('departure', event.target.value)}
            />
          </FormField>
          <FormField label="Load (lb)" htmlFor="load" error={errors.loadWeight}>
            <Input
              id="load"
              type="number"
              inputMode="numeric"
              min={1}
              step={500}
              value={values.loadWeight}
              aria-invalid={Boolean(errors.loadWeight)}
              onChange={(event) => setField('loadWeight', event.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Sample weather every">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            className="w-full"
            aria-label="Weather sampling interval"
            value={String(values.interval)}
            onValueChange={(next) => next && setField('interval', Number(next) as SampleInterval)}
          >
            {SAMPLE_INTERVALS.map((miles) => (
              <ToggleGroupItem key={miles} value={String(miles)} className="flex-1 text-xs">
                {miles} mi
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FormField>
      </SidebarSection>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting && <Spinner className="size-3.5" />}
        {submitting ? 'Planning routes…' : 'Plan route'}
      </Button>
    </form>
  )
})
