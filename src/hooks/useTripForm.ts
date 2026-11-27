import { useMemo, useState } from 'react'

import type { Place } from '@/types/geo'
import type { SampleInterval, TripPlanRequest } from '@/types/trip'
import { addDays, nextHalfHour, toLocalInputValue } from '@/utils/datetime'

export const MAX_DAYS_AHEAD = 7
const MAX_LOAD_LB = 200_000

export interface TripFormValues {
  origin: Place | null
  destination: Place | null
  departure: string
  loadWeight: string
  interval: SampleInterval
}

export type TripFormErrors = Partial<Record<keyof TripFormValues, string>>

const initialValues = (): TripFormValues => ({
  origin: null,
  destination: null,
  departure: toLocalInputValue(nextHalfHour()),
  loadWeight: '35000',
  interval: 25,
})

function validate(values: TripFormValues): TripFormErrors {
  const errors: TripFormErrors = {}
  if (!values.origin) errors.origin = 'Choose an origin from the suggestions.'
  if (!values.destination) errors.destination = 'Choose a destination from the suggestions.'
  if (values.origin && values.destination && values.origin.label === values.destination.label) {
    errors.destination = 'Destination must differ from origin.'
  }

  const departure = new Date(values.departure)
  if (Number.isNaN(departure.getTime())) errors.departure = 'Enter a valid departure time.'
  else if (departure.getTime() < Date.now() - 3_600_000) errors.departure = 'Departure cannot be in the past.'
  else if (departure > addDays(new Date(), MAX_DAYS_AHEAD)) errors.departure = `Must be within ${MAX_DAYS_AHEAD} days.`

  const weight = Number(values.loadWeight)
  if (!Number.isInteger(weight) || weight <= 0 || weight > MAX_LOAD_LB) {
    errors.loadWeight = `Enter a whole number between 1 and ${MAX_LOAD_LB.toLocaleString()}.`
  }
  return errors
}

export function useTripForm() {
  const [values, setValues] = useState<TripFormValues>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const setField = <K extends keyof TripFormValues>(key: K, value: TripFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const swapLocations = () =>
    setValues((current) => ({ ...current, origin: current.destination, destination: current.origin }))

  const toRequest = (): TripPlanRequest | null => {
    setSubmitted(true)
    if (!isValid || !values.origin || !values.destination) return null
    return {
      origin: values.origin,
      destination: values.destination,
      departure_at: new Date(values.departure).toISOString(),
      load_weight_lb: Number(values.loadWeight),
      sample_interval_mi: values.interval,
    }
  }

  return { values, errors: submitted ? errors : {}, setField, swapLocations, toRequest }
}
