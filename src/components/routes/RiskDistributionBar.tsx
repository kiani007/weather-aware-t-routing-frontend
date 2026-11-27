import { RISK_ORDER, RISK_STYLES, UNKNOWN_RISK_COLOR } from '@/constants/risk'
import type { RiskMiles } from '@/types/risk'
import { formatMiles } from '@/utils/format'

interface RiskDistributionBarProps {
  riskMiles: RiskMiles
  unknownMiles?: number
}

export function RiskDistributionBar({ riskMiles, unknownMiles = 0 }: RiskDistributionBarProps) {
  const segments = [
    ...RISK_ORDER.map((key) => ({ key, label: RISK_STYLES[key].label, color: RISK_STYLES[key].color, miles: riskMiles[key] })),
    { key: 'unknown', label: 'Unverified', color: UNKNOWN_RISK_COLOR, miles: unknownMiles },
  ].filter((segment) => segment.miles > 0)
  const total = segments.reduce((sum, segment) => sum + segment.miles, 0) || 1

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-label="Risk distribution by miles">
      {segments.map((segment) => (
        <div
          key={segment.key}
          title={`${segment.label}: ${formatMiles(segment.miles)}`}
          style={{ width: `${(segment.miles / total) * 100}%`, backgroundColor: segment.color }}
        />
      ))}
    </div>
  )
}
