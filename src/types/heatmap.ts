import type { LatLngTuple } from './geo'

export type HeatmapMetric = 'risk' | 'wind' | 'precipitation' | 'snow'

export type HeatmapFrame = Array<number | null>

export interface HeatmapData {
  start: string
  hours: number
  cell_size_deg: number
  points: LatLngTuple[]
  metrics: Record<HeatmapMetric, HeatmapFrame[]>
}
