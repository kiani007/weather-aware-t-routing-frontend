export type RiskKey = 'low' | 'moderate' | 'high' | 'severe' | 'no_travel'

export type RiskValue = 0 | 1 | 2 | 3 | 4

export interface RiskLevel {
  value: RiskValue
  key: RiskKey
  label: string
}

export type RiskMiles = Record<RiskKey, number>
