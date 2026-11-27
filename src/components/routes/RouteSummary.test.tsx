import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeRoute, riskLevel } from '@/test/fixtures'

import { RecommendationNote } from './RecommendationNote'
import { RouteSummary } from './RouteSummary'

describe('RouteSummary', () => {
  it('shows distance, drive time, ETA and risk mileage', () => {
    const route = makeRoute({
      name: 'Route B',
      max_risk: riskLevel('severe'),
      risk_miles: { low: 900, moderate: 50, high: 30, severe: 20, no_travel: 4.4 },
      average_risk: 0.31,
      forecast_coverage: 0.9,
    })
    render(<RouteSummary route={route} />)

    expect(screen.getByText('Route B')).toBeInTheDocument()
    expect(screen.getByText('1,004.4 mi')).toBeInTheDocument()
    expect(screen.getByText('17h 48m')).toBeInTheDocument()
    expect(screen.getByText('Severe')).toBeInTheDocument()
    expect(screen.getByText('Severe+ 24.4 mi')).toBeInTheDocument()
    expect(screen.getByText('High 30 mi')).toBeInTheDocument()
    expect(screen.getByText('Forecast 90%')).toBeInTheDocument()
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
