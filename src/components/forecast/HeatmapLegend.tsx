import { HEATMAP_METRICS } from '@/constants/heatmap'
import { RISK_ORDER, RISK_STYLES, UNKNOWN_RISK_COLOR } from '@/constants/risk'
import type { HeatmapMetric } from '@/types/heatmap'
import { cssGradient } from '@/utils/color'

export function HeatmapLegend({ metric }: { metric: HeatmapMetric }) {
  if (metric === 'risk') {
    return (
      <ul
        className="flex max-w-52 flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-muted-foreground"
        aria-label="Risk legend"
      >
        {RISK_ORDER.map((key) => (
          <li
            key={key}
            className="flex items-center gap-1 whitespace-nowrap"
            title={key === 'low' ? 'Low risk is left unshaded on the map' : undefined}
          >
            {key === 'low' ? (
              // Low cells are not painted, so show an empty ring rather than a filled swatch
              <span className="size-2 rounded-full border" style={{ borderColor: RISK_STYLES.low.color }} />
            ) : (
              <span className="size-2 rounded-full" style={{ backgroundColor: RISK_STYLES[key].color }} />
            )}
            {RISK_STYLES[key].label}
          </li>
        ))}
        <li className="flex items-center gap-1 whitespace-nowrap" title="No forecast data for this area and time">
          <span className="size-2 rounded-full" style={{ backgroundColor: UNKNOWN_RISK_COLOR }} />
          Unknown
        </li>
      </ul>
    )
  }

  const config = HEATMAP_METRICS[metric]
  return (
    <div className="w-32 shrink-0" aria-label={`${config.label} legend`}>
      <div className="mb-0.5 text-[10px] leading-none font-medium">
        {config.label} ({config.unit})
      </div>
      <div className="h-1.5 rounded-full" style={{ background: cssGradient(config.stops) }} />
      <div className="mt-0.5 flex justify-between text-[10px] leading-none text-muted-foreground">
        <span>{config.legend[0]}</span>
        <span>{config.legend[config.legend.length - 1]}</span>
      </div>
    </div>
  )
}
