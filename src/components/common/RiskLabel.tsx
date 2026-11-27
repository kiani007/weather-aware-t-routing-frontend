import { RISK_STYLES } from '@/constants/risk'
import type { RiskKey } from '@/types/risk'

/** Plain risk label: a colored dot and colored text, no badge background. */
export function RiskLabel({ risk }: { risk: RiskKey }) {
  const style = RISK_STYLES[risk]
  return (
    <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap" style={{ color: style.color }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {style.label}
    </span>
  )
}
