import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Place } from '@/types/geo'
import type { Trip } from '@/types/trip'
import { addDays, toLocalInputValue } from '@/utils/datetime'

import { useTripForm, valuesFromTrip } from './useTripForm'

const chicago: Place = { label: 'Chicago, Illinois, United States', lat: 41.88, lon: -87.63 }
const denver: Place = { label: 'Denver, Colorado, United States', lat: 39.74, lon: -104.99 }

function setup() {
  const hook = renderHook(() => useTripForm())
  const fill = () =>
    act(() => {
      hook.result.current.setField('origin', chicago)
      hook.result.current.setField('destination', denver)
    })
  const submit = () => {
    let request: ReturnType<typeof hook.result.current.toRequest> = null
    act(() => {
      request = hook.result.current.toRequest()
    })
    return request
  }
  return { hook, fill, submit }
}

describe('useTripForm', () => {
  it('hides errors until the first submit', () => {
    const { hook, submit } = setup()
    expect(hook.result.current.errors).toEqual({})

    expect(submit()).toBeNull()
    expect(hook.result.current.errors.origin).toMatch(/origin/i)
    expect(hook.result.current.errors.destination).toMatch(/destination/i)
  })

  it('builds the API request from valid values', () => {
    const { hook, fill, submit } = setup()
    fill()
    act(() => {
      hook.result.current.setField('loadWeight', '42000')
      hook.result.current.setField('interval', 10)
    })

    expect(submit()).toMatchObject({
      origin: chicago,
      destination: denver,
      load_weight_lb: 42000,
      sample_interval_mi: 10,
    })
  })

  it('rejects the same origin and destination', () => {
    const { hook, submit } = setup()
    act(() => {
      hook.result.current.setField('origin', chicago)
      hook.result.current.setField('destination', chicago)
    })
    expect(submit()).toBeNull()
    expect(hook.result.current.errors.destination).toMatch(/differ/i)
  })

  it('rejects departures in the past or beyond the forecast window', () => {
    const { hook, fill, submit } = setup()
    fill()

    act(() => hook.result.current.setField('departure', toLocalInputValue(addDays(new Date(), -1))))
    expect(submit()).toBeNull()
    expect(hook.result.current.errors.departure).toMatch(/past/i)

    act(() => hook.result.current.setField('departure', toLocalInputValue(addDays(new Date(), 8))))
    expect(submit()).toBeNull()
    expect(hook.result.current.errors.departure).toMatch(/7 days/i)
  })

  it.each(['0', '-5', '12.5', 'abc', '250000'])('rejects load weight %s', (weight) => {
    const { hook, fill, submit } = setup()
    fill()
    act(() => hook.result.current.setField('loadWeight', weight))
    expect(submit()).toBeNull()
    expect(hook.result.current.errors.loadWeight).toBeDefined()
  })

  it('swaps origin and destination', () => {
    const { hook, fill } = setup()
    fill()
    act(() => hook.result.current.swapLocations())
    expect(hook.result.current.values.origin).toEqual(denver)
    expect(hook.result.current.values.destination).toEqual(chicago)
  })
})

describe('reopening a saved trip', () => {
  const saved = {
    origin: chicago,
    destination: denver,
    load_weight_lb: 45_000,
    sample_interval_mi: 10 as const,
  }

  it('fills the form with the trip and keeps an upcoming departure', () => {
    const departure = addDays(new Date(), 1)
    const { result } = renderHook(() =>
      useTripForm(valuesFromTrip({ ...saved, departure_at: departure.toISOString() } as Trip)),
    )

    expect(result.current.values).toMatchObject({
      origin: chicago,
      destination: denver,
      loadWeight: '45000',
      interval: 10,
      departure: toLocalInputValue(departure),
    })
  })

  it('moves a past departure forward so the trip can be planned again', () => {
    const values = valuesFromTrip({ ...saved, departure_at: '2020-01-01T00:00:00Z' } as Trip)
    expect(new Date(values.departure!).getTime()).toBeGreaterThan(Date.now())
  })
})
