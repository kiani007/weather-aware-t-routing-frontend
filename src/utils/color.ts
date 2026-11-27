import type { GradientStop } from '@/constants/heatmap'

type Rgb = [number, number, number]

const hexToRgb = (hex: string): Rgb => {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export type ColorScale = (t: number) => Rgb

export function createColorScale(stops: GradientStop[]): ColorScale {
  const parsed = stops.map(([position, color]) => ({ position, rgb: hexToRgb(color) }))
  return (t) => {
    const clamped = Math.min(1, Math.max(0, t))
    const upperIndex = parsed.findIndex((stop) => stop.position >= clamped)
    const upper = parsed[upperIndex === -1 ? parsed.length - 1 : upperIndex]!
    const lower = parsed[Math.max(0, upperIndex - 1)]!
    const span = upper.position - lower.position || 1
    const f = (clamped - lower.position) / span
    return [0, 1, 2].map((i) => Math.round(lower.rgb[i]! + (upper.rgb[i]! - lower.rgb[i]!) * f)) as Rgb
  }
}

export const cssGradient = (stops: GradientStop[], direction = 'to right') =>
  `linear-gradient(${direction}, ${stops.map(([p, c]) => `${c} ${p * 100}%`).join(', ')})`
