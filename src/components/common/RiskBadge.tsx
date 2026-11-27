import { cn } from '@/lib/utils'

import { riskStyle } from '@/constants/risk'
import type { RiskKey } from '@/types/risk'

/** Pill-style risk badge. Null shows Unknown. */
export function RiskBadge({ risk, className }: { risk: RiskKey | null; className?: string }) {
  const style = riskStyle(risk)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        style.badgeClass,
        className,
      )}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {style.label}
    </span>
  )
}
