import type { RiskKey, RiskLevel, RiskValue } from '@/types/risk'
import type { Checkpoint, RouteOption } from '@/types/trip'

const LEVELS: Record<RiskKey, [RiskValue, string]> = {
  low: [0, 'Low'],
  moderate: [1, 'Moderate'],
  high: [2, 'High'],
  severe: [3, 'Severe'],
  no_travel: [4, 'No Travel'],
}

export const riskLevel = (key: RiskKey): RiskLevel => ({ key, value: LEVELS[key][0], label: LEVELS[key][1] })

export function makeCheckpoint(overrides: Partial<Checkpoint> = {}): Checkpoint {
  return {
    sequence: 0,
    lat: 40,
    lon: -100,
    mile_marker: 0,
    represented_mi: 12.5,
    eta: '2026-11-26T21:05:00Z',
    has_forecast: true,
    wind_mph: 16,
    rain_in_hr: 0,
    snow_in_hr: 0,
    risk: riskLevel('low'),
    reasons: [],
    ...overrides,
  }
}

export function makeRoute(overrides: Partial<RouteOption> = {}): RouteOption {
  return {
    id: 1,
    index: 0,
    name: 'Route A',
    summary: 'I 80',
    polyline: '',
    distance_mi: 1004.4,
    duration_s: 64_080,
    arrival_at: '2026-11-27T14:17:00Z',
    risk_miles: { low: 1004.4, moderate: 0, high: 0, severe: 0, no_travel: 0 },
    average_risk: 0,
    max_risk: riskLevel('low'),
    forecast_coverage: 1,
    is_recommended: false,
    recommendation_reason: '',
    checkpoints: [],
    ...overrides,
  }
}
