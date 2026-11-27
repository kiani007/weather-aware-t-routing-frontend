import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Trip } from '@/types/trip'
import type { RecentTrip } from '@/utils/recentTrips'

import { PastTripNote } from './PastTripNote'
import { RecentTrips } from './RecentTrips'

const recent: RecentTrip[] = [
  {
    id: 'kc',
    origin_label: 'Kansas City, Missouri, United States',
    destination_label: 'Denver, Colorado, United States',
    departure_at: '2026-11-28T18:00:00Z',
    load_weight_lb: 45_000,
    recommended_route: 'Route B',
    planned_at: '2026-11-27T21:00:00Z',
  },
  {
    id: 'chi',
    origin_label: 'Chicago, Illinois, United States',
    destination_label: 'Denver, Colorado, United States',
    departure_at: '2026-11-28T07:00:00Z',
    load_weight_lb: 35_000,
    recommended_route: 'Route A',
    planned_at: '2026-11-27T20:00:00Z',
  },
]

const props = { activeTripId: null, loadingTripId: null, onOpen: () => {}, onClear: () => {} }

describe('RecentTrips', () => {
  it('lists trips with short place names and the recommended route', () => {
    render(<RecentTrips trips={recent} {...props} />)

    expect(screen.getByText('Kansas City, Missouri → Denver, Colorado')).toBeInTheDocument()
    expect(screen.getByText(/45,000 lb · Route B ★/)).toBeInTheDocument()
    expect(screen.getByText('Saved in this browser only.')).toBeInTheDocument()
  })

  it('opens a trip and clears the list', async () => {
    const onOpen = vi.fn()
    const onClear = vi.fn()
    render(<RecentTrips trips={recent} {...props} onOpen={onOpen} onClear={onClear} />)

    await userEvent.click(screen.getByText('Chicago, Illinois → Denver, Colorado'))
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(onOpen).toHaveBeenCalledWith('chi')
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('marks the trip on the map and blocks clicks while one is loading', () => {
    render(<RecentTrips trips={recent} {...props} activeTripId="kc" loadingTripId="chi" />)

    const [first, second] = screen.getAllByRole('button', { name: /→/ })
    expect(first).toHaveAttribute('aria-current', 'true')
    expect(second).toBeDisabled()
  })

  it('renders nothing when there is no history', () => {
    const { container } = render(<RecentTrips trips={[]} {...props} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('PastTripNote', () => {
  const base = { created_at: '2026-11-27T20:00:00Z' } as Trip

  it('explains that a past trip shows the forecast from planning time', () => {
    render(<PastTripNote trip={{ ...base, departure_at: '2020-01-01T00:00:00Z' }} />)
    expect(screen.getByRole('note')).toHaveTextContent(/Routes and risk show the forecast from when it was planned/)
  })

  it('stays hidden for upcoming trips', () => {
    const { container } = render(<PastTripNote trip={{ ...base, departure_at: '2099-01-01T00:00:00Z' }} />)
    expect(container).toBeEmptyDOMElement()
  })
})
