import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Trip } from '@/types/trip'

import { TripSummary } from './TripSummary'

const trip: Trip = {
  id: 't1',
  origin_label: 'Chicago, Illinois, United States',
  destination_label: 'Denver, Colorado, United States',
  departure_at: '2026-11-28T07:00:00Z',
  load_weight_lb: 35_000,
  sample_interval_mi: 25,
  created_at: '2026-11-28T06:00:00Z',
  origin: { label: 'Chicago', lat: 41.9, lon: -87.6 },
  destination: { label: 'Denver', lat: 39.7, lon: -105 },
  routes: [],
}

describe('TripSummary', () => {
  it('recaps the planned trip on one line', () => {
    render(<TripSummary trip={trip} onEdit={() => {}} />)

    expect(
      screen.getByText('Chicago, Illinois, United States → Denver, Colorado, United States'),
    ).toBeInTheDocument()
    expect(screen.getByText(/35,000 lb · every 25 mi/)).toBeInTheDocument()
  })

  it('reopens the form on Edit', async () => {
    const onEdit = vi.fn()
    render(<TripSummary trip={trip} onEdit={onEdit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledOnce()
  })
})
