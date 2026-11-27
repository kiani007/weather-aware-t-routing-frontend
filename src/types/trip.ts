import type { Place } from './geo'
import type { RiskLevel, RiskMiles } from './risk'

export const SAMPLE_INTERVALS = [10, 25, 50] as const
export type SampleInterval = (typeof SAMPLE_INTERVALS)[number]

export interface TripPlanRequest {
  origin: Place
  destination: Place
  departure_at: string
  load_weight_lb: number
  sample_interval_mi: SampleInterval
}

export interface Checkpoint {
  sequence: number
  lat: number
  lon: number
  mile_marker: number
  represented_mi: number
  eta: string
  has_forecast: boolean
  wind_mph: number | null
  rain_in_hr: number | null
  snow_in_hr: number | null
  /** Null when the weather at this checkpoint is unknown (no forecast data) */
  risk: RiskLevel | null
  reasons: string[]
}

export interface RouteOption {
  id: number
  index: number
  name: string
  summary: string
  polyline: string
  distance_mi: number
  duration_s: number
  arrival_at: string
  risk_miles: RiskMiles
  /** Miles whose weather could not be verified; not counted in risk_miles */
  unknown_miles: number
  /** Both null when no checkpoint on the route has a forecast (never a stand-in "safe" value) */
  average_risk: number | null
  max_risk: RiskLevel | null
  forecast_coverage: number
  is_recommended: boolean
  recommendation_reason: string
  checkpoints: Checkpoint[]
}

export interface TripSummary {
  id: string
  origin_label: string
  destination_label: string
  departure_at: string
  load_weight_lb: number
  sample_interval_mi: SampleInterval
  created_at: string
}

export interface Trip extends TripSummary {
  origin: Place
  destination: Place
  routes: RouteOption[]
}
