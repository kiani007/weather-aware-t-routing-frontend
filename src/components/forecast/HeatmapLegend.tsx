import { HEATMAP_METRICS } from '@/constants/heatmap'
import { RISK_ORDER, RISK_STYLES } from '@/constants/risk'
import type { HeatmapMetric } from '@/types/heatmap'
import { cssGradient } from '@/utils/color'

export function HeatmapLegend({ metric }: { metric: HeatmapMetric }) {
  if (metric === 'risk') {
    return (
      <ul className="flex shrink-0 items-center gap-2.5 text-[10px] text-muted-foreground" aria-label="Risk legend">
        {RISK_ORDER.map((key) => (
          <li key={key} className="flex items-center gap-1 whitespace-nowrap">
            <span className="size-2 rounded-full" style={{ backgroundColor: RISK_STYLES[key].color }} />
            {RISK_STYLES[key].label}
          </li>
        ))}
      </ul>
    )
  }

  const config = HEATMAP_METRICS[metric]
  return (
    <div className="w-28 shrink-0" aria-label={`${config.label} legend`}>
      <div className="h-1.5 rounded-full" style={{ background: cssGradient(config.stops) }} />
      <div className="mt-0.5 flex justify-between text-[10px] leading-none text-muted-foreground">
        <span>{config.legend[0]}</span>
        <span>
          {config.legend[config.legend.length - 1]} {config.unit}
        </span>
      </div>
    </div>
  )
}
