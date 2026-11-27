import { riskStyle } from '@/constants/risk'
import type { RiskKey } from '@/types/risk'

/** Plain risk label: a colored dot and colored text, no badge background. Null shows Unknown. */
export function RiskLabel({ risk }: { risk: RiskKey | null }) {
  const style = riskStyle(risk)
  return (
    <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap" style={{ color: style.color }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {style.label}
    </span>
  )
}
