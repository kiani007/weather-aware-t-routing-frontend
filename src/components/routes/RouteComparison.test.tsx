import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeRoute, riskLevel } from '@/test/fixtures'

import { RecommendationNote } from './RecommendationNote'
import { RouteComparison } from './RouteComparison'

const routes = [
  makeRoute({ id: 11, index: 0, name: 'Route A', is_recommended: true, distance_mi: 296.6, duration_s: 20_145 }),
  makeRoute({
    id: 12,
    index: 1,
    name: 'Route B',
    distance_mi: 310.2,
    duration_s: 20_892,
    max_risk: riskLevel('severe'),
    risk_miles: { low: 230, moderate: 20, high: 10, severe: 15, no_travel: 5.2 },
    unknown_miles: 30,
    forecast_coverage: 0.9,
  }),
]

describe('RouteComparison', () => {
  it('shows every route side by side', () => {
    render(<RouteComparison routes={routes} selectedRouteId={11} onSelect={() => {}} />)

    expect(screen.getByRole('button', { name: /A/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /B/ })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('296.6 mi')).toBeInTheDocument()
    expect(screen.getByText('310.2 mi')).toBeInTheDocument()
    expect(screen.getByText('20.2 mi')).toBeInTheDocument()
    expect(screen.getByText('Severe')).toBeInTheDocument()
  })

  it('shows unverified weather miles', () => {
    render(<RouteComparison routes={routes} selectedRouteId={11} onSelect={() => {}} />)

    const unverifiedRow = screen.getByRole('row', { name: /Unverified/ })
    expect(within(unverifiedRow).getByText('30 mi')).toBeInTheDocument()
    expect(within(unverifiedRow).getByText('0 mi')).toHaveClass('font-semibold')
  })

  it('bolds the best value in a row', () => {
    render(<RouteComparison routes={routes} selectedRouteId={11} onSelect={() => {}} />)

    const distanceRow = screen.getByRole('row', { name: /Distance/ })
    expect(within(distanceRow).getByText('296.6 mi')).toHaveClass('font-semibold')
    expect(within(distanceRow).getByText('310.2 mi')).not.toHaveClass('font-semibold')
  })

  it('selects a route from its tab or any of its cells', async () => {
    const onSelect = vi.fn()
    render(<RouteComparison routes={routes} selectedRouteId={11} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /B/ }))
    await userEvent.click(screen.getByText('310.2 mi'))

    expect(onSelect).toHaveBeenNthCalledWith(1, 12)
    expect(onSelect).toHaveBeenNthCalledWith(2, 12)
  })
})

describe('RecommendationNote', () => {
  it('names the recommended route and explains why', () => {
    const route = makeRoute({
      name: 'Route B',
      is_recommended: true,
      recommendation_reason: 'Lowest Severe-risk mileage (0.0 mi vs 12.5 mi on the next best route).',
    })
    render(<RecommendationNote route={route} />)

    expect(screen.getByText('Recommended: Route B')).toBeInTheDocument()
    expect(screen.getByText(/Lowest Severe-risk mileage/)).toBeInTheDocument()
  })

  it('warns when even the best route crosses No Travel conditions', () => {
    render(<RecommendationNote route={makeRoute({ is_recommended: true, max_risk: riskLevel('no_travel') })} />)

    expect(screen.getByText(/Every option crosses No Travel conditions/)).toBeInTheDocument()
  })
})
