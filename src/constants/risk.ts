import type { RiskKey, RiskValue } from '@/types/risk'

export interface RiskStyle {
  label: string
  color: string
  badgeClass: string
}

export const RISK_ORDER: RiskKey[] = ['low', 'moderate', 'high', 'severe', 'no_travel']

export const RISK_STYLES: Record<RiskKey, RiskStyle> = {
  low: { label: 'Low', color: '#16a34a', badgeClass: 'bg-green-50 text-green-700 ring-green-600/20' },
  moderate: { label: 'Moderate', color: '#f59e0b', badgeClass: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  high: { label: 'High', color: '#ea580c', badgeClass: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
  severe: { label: 'Severe', color: '#dc2626', badgeClass: 'bg-red-50 text-red-700 ring-red-600/20' },
  no_travel: { label: 'No Travel', color: '#7f1d1d', badgeClass: 'bg-red-100 text-red-900 ring-red-900/30' },
}

// Checkpoints and routes whose weather could not be verified
export const UNKNOWN_RISK_COLOR = '#94a3b8'
export const UNKNOWN_RISK_STYLE: RiskStyle = {
  label: 'Unknown',
  color: UNKNOWN_RISK_COLOR,
  badgeClass: 'bg-slate-50 text-slate-600 ring-slate-500/20',
}

/** Style for a risk level, or the Unknown style when there is none */
export const riskStyle = (risk: RiskKey | null): RiskStyle => (risk ? RISK_STYLES[risk] : UNKNOWN_RISK_STYLE)

export const riskKeyFromValue = (value: RiskValue): RiskKey => RISK_ORDER[value] ?? 'low'
