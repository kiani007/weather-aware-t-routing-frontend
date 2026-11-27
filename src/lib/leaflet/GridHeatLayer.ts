import L from 'leaflet'

import type { LatLngTuple } from '@/types/geo'
import type { ColorScale } from '@/utils/color'

export interface GridHeatData {
  points: LatLngTuple[]
  values: Array<number | null>
  cellSizeDeg: number
  max: number
  minVisible: number
  scale: ColorScale
}

const MAX_ALPHA = 0.62
const MIN_ALPHA = 0.18

/**
 * Canvas overlay that paints each forecast grid cell with its true value (no additive
 * accumulation like classic point heatmaps), then blurs the result for a smooth field.
 */
export class GridHeatLayer extends L.Layer {
  private canvas?: HTMLCanvasElement
  private buffer = document.createElement('canvas')
  private data?: GridHeatData
  private host?: L.Map

  onAdd(map: L.Map): this {
    this.host = map
    this.canvas = L.DomUtil.create('canvas', 'leaflet-zoom-hide pointer-events-none')
    map.getPanes().overlayPane.appendChild(this.canvas)
    map.on('moveend zoomend resize', this.reset, this)
    this.reset()
    return this
  }

  onRemove(map: L.Map): this {
    map.off('moveend zoomend resize', this.reset, this)
    this.canvas?.remove()
    this.canvas = undefined
    this.host = undefined
    return this
  }

  setData(data: GridHeatData): this {
    this.data = data
    this.draw()
    return this
  }

  private reset(): void {
    if (!this.canvas || !this.host) return
    const size = this.host.getSize()
    L.DomUtil.setPosition(this.canvas, this.host.containerPointToLayerPoint([0, 0]))
    this.canvas.width = this.buffer.width = size.x
    this.canvas.height = this.buffer.height = size.y
    this.draw()
  }

  private draw(): void {
    const map = this.host
    const ctx = this.canvas?.getContext('2d')
    const buffer = this.buffer.getContext('2d')
    if (!map || !ctx || !buffer || !this.canvas) return
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    buffer.clearRect(0, 0, this.buffer.width, this.buffer.height)
    if (!this.data || this.canvas.width === 0 || this.canvas.height === 0) return

    const { points, values, cellSizeDeg, max, minVisible, scale } = this.data
    const half = cellSizeDeg / 2
    let cellPx = 0

    points.forEach(([lat, lon], i) => {
      const value = values[i]
      if (value == null) return
      const t = Math.min(1, value / max)
      if (t < minVisible || (minVisible > 0 && t === 0)) return
      const topLeft = map.latLngToContainerPoint([lat + half, lon - half])
      const bottomRight = map.latLngToContainerPoint([lat - half, lon + half])
      const [r, g, b] = scale(t)
      buffer.fillStyle = `rgba(${r},${g},${b},${MIN_ALPHA + (MAX_ALPHA - MIN_ALPHA) * t})`
      buffer.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x + 1, bottomRight.y - topLeft.y + 1)
      cellPx ||= bottomRight.x - topLeft.x
    })

    ctx.filter = `blur(${Math.min(28, Math.max(2, cellPx * 0.45))}px)`
    ctx.drawImage(this.buffer, 0, 0)
    ctx.filter = 'none'
  }
}
