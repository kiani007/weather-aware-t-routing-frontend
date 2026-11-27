import type { HeatmapMetric } from '@/types/heatmap'

export type GradientStop = [position: number, color: string]

export interface MetricConfig {
  label: string
  unit: string
  max: number
  minVisible: number
  stops: GradientStop[]
  legend: string[]
}

export const HEATMAP_METRICS: Record<HeatmapMetric, MetricConfig> = {
  risk: {
    label: 'Risk',
    unit: 'level',
    max: 4,
    minVisible: 0.2,
    stops: [
      [0, '#16a34a'],
      [0.25, '#f59e0b'],
      [0.5, '#ea580c'],
      [0.75, '#dc2626'],
      [1, '#7f1d1d'],
    ],
    legend: ['Low', 'Mod', 'High', 'Severe', 'No Travel'],
  },
  wind: {
    label: 'Wind',
    unit: 'mph',
    max: 60,
    minVisible: 0,
    stops: [
      [0, '#bae6fd'],
      [0.25, '#38bdf8'],
      [0.42, '#22c55e'],
      [0.58, '#facc15'],
      [0.75, '#f97316'],
      [0.92, '#dc2626'],
      [1, '#7f1d1d'],
    ],
    legend: ['0', '15', '30', '45', '60+'],
  },
  precipitation: {
    label: 'Rain',
    unit: 'in/hr',
    max: 0.6,
    minVisible: 0.01,
    stops: [
      [0, '#dbeafe'],
      [0.17, '#93c5fd'],
      [0.42, '#3b82f6'],
      [0.83, '#1e3a8a'],
      [1, '#7f1d1d'],
    ],
    legend: ['0', '0.15', '0.3', '0.45', '0.6+'],
  },
  snow: {
    label: 'Snow',
    unit: 'in/hr',
    max: 2.5,
    minVisible: 0.01,
    stops: [
      [0, '#e0f2fe'],
      [0.2, '#7dd3fc'],
      [0.4, '#818cf8'],
      [0.8, '#a21caf'],
      [1, '#581c87'],
    ],
    legend: ['0', '0.6', '1.2', '1.9', '2.5+'],
  },
}

export const HEATMAP_METRIC_ORDER: HeatmapMetric[] = ['risk', 'wind', 'precipitation', 'snow']

export const PLAYBACK_INTERVAL_MS = 650
