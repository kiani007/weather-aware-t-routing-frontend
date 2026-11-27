import { RISK_ORDER, RISK_STYLES } from '@/constants/risk'
import type { RiskMiles } from '@/types/risk'
import { formatMiles } from '@/utils/format'

export function RiskDistributionBar({ riskMiles }: { riskMiles: RiskMiles }) {
  const total = RISK_ORDER.reduce((sum, key) => sum + riskMiles[key], 0) || 1
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-label="Risk distribution by miles">
      {RISK_ORDER.filter((key) => riskMiles[key] > 0).map((key) => (
        <div
          key={key}
          title={`${RISK_STYLES[key].label}: ${formatMiles(riskMiles[key])}`}
          style={{ width: `${(riskMiles[key] / total) * 100}%`, backgroundColor: RISK_STYLES[key].color }}
        />
      ))}
    </div>
  )
}
