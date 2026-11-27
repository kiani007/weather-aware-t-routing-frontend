import { useEffect, useMemo, useRef } from 'react'
import { useMap } from 'react-leaflet'

import { HEATMAP_METRICS } from '@/constants/heatmap'
import { GridHeatLayer } from '@/lib/leaflet/GridHeatLayer'
import type { HeatmapData, HeatmapMetric } from '@/types/heatmap'
import { createColorScale } from '@/utils/color'

interface HeatmapLayerProps {
  data: HeatmapData
  metric: HeatmapMetric
  hour: number
}

export function HeatmapLayer({ data, metric, hour }: HeatmapLayerProps) {
  const map = useMap()
  const layerRef = useRef<GridHeatLayer | null>(null)
  const config = HEATMAP_METRICS[metric]
  const scale = useMemo(() => createColorScale(config.stops), [config])

  useEffect(() => {
    const layer = new GridHeatLayer().addTo(map)
    layerRef.current = layer
    return () => {
      layer.remove()
      layerRef.current = null
    }
  }, [map])

  useEffect(() => {
    layerRef.current?.setData({
      points: data.points,
      values: data.metrics[metric][hour] ?? [],
      cellSizeDeg: data.cell_size_deg,
      max: config.max,
      minVisible: config.minVisible,
      scale,
    })
  }, [data, metric, hour, config, scale])

  return null
}
