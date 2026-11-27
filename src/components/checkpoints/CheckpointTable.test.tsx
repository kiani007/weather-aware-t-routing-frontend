import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeCheckpoint, riskLevel } from '@/test/fixtures'

import { CheckpointTable } from './CheckpointTable'

const checkpoints = [
  makeCheckpoint({ sequence: 0, mile_marker: 25, eta: '2026-11-26T21:05:00Z' }),
  makeCheckpoint({
    sequence: 1,
    mile_marker: 50,
    eta: '2026-11-26T21:40:00Z',
    wind_mph: 37,
    rain_in_hr: 0.1,
    risk: riskLevel('severe'),
    reasons: ['Wind 37 mph is High', 'Load 45,000 lb raises High wind to Severe'],
  }),
  makeCheckpoint({
    sequence: 2,
    mile_marker: 75,
    eta: '2026-11-27T00:10:00Z',
    has_forecast: false,
    wind_mph: null,
    rain_in_hr: null,
    snow_in_hr: null,
    risk: null,
  }),
]

const rows = () => screen.getAllByRole('row').slice(1)

describe('CheckpointTable', () => {
  it('lists mile, ETA, wind, rain, snow and risk for each checkpoint', () => {
    render(<CheckpointTable routeName="Route B" checkpoints={checkpoints} focusedSequence={null} onFocus={() => {}} />)

    expect(screen.getByRole('region', { name: 'Route B checkpoints' })).toBeInTheDocument()
    expect(rows()).toHaveLength(3)
    const cells = within(rows()[1]!).getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells).toEqual(['50', '9:40 PM', '37 mph', '0.10"', '0.00"', 'Severe'])
  })

  it('shows the weekday only on the first row of each day', () => {
    render(<CheckpointTable routeName="Route B" checkpoints={checkpoints} focusedSequence={null} onFocus={() => {}} />)

    expect(within(rows()[0]!).getAllByRole('cell')[1]).toHaveTextContent('Thu 9:05 PM')
    expect(within(rows()[1]!).getAllByRole('cell')[1]).toHaveTextContent(/^9:40 PM$/)
    expect(within(rows()[2]!).getAllByRole('cell')[1]).toHaveTextContent('Fri 12:10 AM')
  })

  it('explains the risk on hover and marks unknown weather', () => {
    render(<CheckpointTable routeName="Route B" checkpoints={checkpoints} focusedSequence={null} onFocus={() => {}} />)

    expect(rows()[1]).toHaveAttribute('title', 'Wind 37 mph is High\nLoad 45,000 lb raises High wind to Severe')
    expect(within(rows()[2]!).getByText('Unknown')).toBeInTheDocument()
    expect(within(rows()[2]!).queryByText('Low')).not.toBeInTheDocument()
  })

  it('focuses a checkpoint when its row is clicked', async () => {
    const onFocus = vi.fn()
    render(<CheckpointTable routeName="Route B" checkpoints={checkpoints} focusedSequence={0} onFocus={onFocus} />)

    expect(rows()[0]).toHaveAttribute('data-state', 'selected')
    await userEvent.click(rows()[1]!)
    expect(onFocus).toHaveBeenCalledWith(1)
  })
})
