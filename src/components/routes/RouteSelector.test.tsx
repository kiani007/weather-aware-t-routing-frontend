import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeRoute } from '@/test/fixtures'

import { RouteSelector } from './RouteSelector'

const routes = [
  makeRoute({ id: 11, index: 0, name: 'Route A', is_recommended: true, recommendation_reason: 'Fastest.' }),
  makeRoute({ id: 12, index: 1, name: 'Route B', duration_s: 71_520 }),
  makeRoute({ id: 13, index: 2, name: 'Route C', duration_s: 77_880 }),
]

describe('RouteSelector', () => {
  it('shows each route with its drive time and marks the recommended one', () => {
    render(<RouteSelector routes={routes} selectedRouteId={11} onSelect={() => {}} />)

    const items = screen.getAllByRole('radio')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('A★17h 48m')
    expect(items[0]).toHaveAttribute('aria-checked', 'true')
    expect(items[1]).toHaveTextContent('B19h 52m')
    expect(screen.getByLabelText('recommended')).toBeInTheDocument()
  })

  it('selects another route by id', async () => {
    const onSelect = vi.fn()
    render(<RouteSelector routes={routes} selectedRouteId={11} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('radio', { name: /C/ }))
    expect(onSelect).toHaveBeenCalledWith(13)
  })

  it('ignores clicks on the route that is already selected', async () => {
    const onSelect = vi.fn()
    render(<RouteSelector routes={routes} selectedRouteId={11} onSelect={onSelect} />)

    await userEvent.click(screen.getAllByRole('radio')[0]!)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
