import { ChevronUp, Minus, Pause, Play } from 'lucide-react'
import { useState } from 'react'

import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { HEATMAP_METRIC_ORDER, HEATMAP_METRICS } from '@/constants/heatmap'
import type { HeatmapMetric } from '@/types/heatmap'
import { formatShortDateTime } from '@/utils/format'

import { HeatmapLegend } from './HeatmapLegend'

interface ForecastBarProps {
  hour: number
  maxHour: number
  time: Date
  metric: HeatmapMetric
  playing: boolean
  loading: boolean
  error?: string
  onHourChange: (hour: number) => void
  onMetricChange: (metric: HeatmapMetric) => void
  onTogglePlay: () => void
}

const isSmallScreen = () => window.matchMedia('(max-width: 767px)').matches

export function ForecastBar(props: ForecastBarProps) {
  const { hour, maxHour, time, metric, playing, loading, error } = props
  const [minimized, setMinimized] = useState(isSmallScreen)
  const disabled = loading || Boolean(error)

  const playButton = (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={props.onTogglePlay}
      disabled={disabled}
      aria-label={playing ? 'Pause forecast' : 'Play forecast'}
    >
      {loading ? <Spinner className="size-3" /> : playing ? <Pause /> : <Play />}
    </Button>
  )
  const timeLabel = (
    <span className="w-28 shrink-0 text-xs font-medium whitespace-nowrap tabular-nums">
      +{hour}h · {formatShortDateTime(time)}
    </span>
  )

  if (minimized) {
    return (
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border bg-background py-1 pr-1 pl-1.5 shadow-sm">
        {playButton}
        {timeLabel}
        <Button variant="ghost" size="icon-xs" onClick={() => setMinimized(false)} aria-label="Show weather controls">
          <ChevronUp />
        </Button>
      </div>
    )
  }

  return (
    <div className="pointer-events-auto flex w-full max-w-3xl flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 shadow-sm md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:min-w-64">
        {playButton}
        {timeLabel}
        <Slider
          className="flex-1"
          min={0}
          max={maxHour}
          step={1}
          value={[hour]}
          disabled={disabled}
          aria-label="Forecast hour"
          onValueChange={([value]) => value !== undefined && props.onHourChange(value)}
        />
        <Button
          variant="ghost"
          size="icon-xs"
          className="md:hidden"
          onClick={() => setMinimized(true)}
          aria-label="Minimize weather controls"
        >
          <Minus />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          size="sm"
          spacing={0}
          aria-label="Heatmap layer"
          value={metric}
          onValueChange={(next) => next && props.onMetricChange(next as HeatmapMetric)}
        >
          {HEATMAP_METRIC_ORDER.map((key) => (
            <ToggleGroupItem key={key} value={key} className="px-2 text-xs data-[state=on]:bg-muted">
              {HEATMAP_METRICS[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {error ? <span className="truncate text-[11px] text-destructive">{error}</span> : <HeatmapLegend metric={metric} />}
      </div>
      <p className="text-[10px] leading-snug text-muted-foreground md:basis-full">
        Map shades the {HEATMAP_METRICS[metric].label.toLowerCase()} around the route at {formatShortDateTime(time)}{' '}
        (grey = no forecast data). Checkpoints are rated at the truck&apos;s ETA, so the two can differ.
      </p>
    </div>
  )
}
