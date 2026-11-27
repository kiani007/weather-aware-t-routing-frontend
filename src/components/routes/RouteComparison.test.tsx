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

    expect(screen.getByText('Recommended route')).toBeInTheDocument()
    expect(screen.getByText('Best option')).toBeInTheDocument()
    expect(screen.getByText('Route B')).toBeInTheDocument()
    expect(screen.getByText(/Lowest Severe-risk mileage/)).toBeInTheDocument()
  })

  it('lists travel time, distance, maximum risk and forecast coverage', () => {
    render(<RecommendationNote route={makeRoute({ is_recommended: true, forecast_coverage: 1 })} />)

    const value = (label: string) => screen.getByText(label).nextElementSibling?.textContent
    expect(value('Travel time')).toBe('17h 48m')
    expect(value('Distance')).toBe('1,004.4 mi')
    expect(value('Maximum risk')).toBe('Low')
    expect(value('Forecast coverage')).toBe('100%')
    expect(screen.queryByText(/unverified/)).not.toBeInTheDocument()
  })

  it('flags unverified miles', () => {
    render(
      <RecommendationNote route={makeRoute({ is_recommended: true, forecast_coverage: 0.9, unknown_miles: 30 })} />,
    )

    expect(screen.getByText('Forecast coverage').nextElementSibling).toHaveTextContent('90%30 mi unverified')
    expect(screen.getByText('30 mi unverified')).toBeInTheDocument()
  })

  it('offers to show the recommended route when another one is selected', async () => {
    const onSelect = vi.fn()
    const route = makeRoute({ id: 7, is_recommended: true })
    const { rerender } = render(<RecommendationNote route={route} selected onSelect={onSelect} />)
    expect(screen.queryByRole('button', { name: 'Show on map' })).not.toBeInTheDocument()

    rerender(<RecommendationNote route={route} selected={false} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Show on map' }))
    expect(onSelect).toHaveBeenCalledWith(7)
  })

  it('warns when even the best route crosses No Travel conditions', () => {
    render(<RecommendationNote route={makeRoute({ is_recommended: true, max_risk: riskLevel('no_travel') })} />)

    expect(screen.getByText(/Every option crosses No Travel conditions/)).toBeInTheDocument()
  })
})
