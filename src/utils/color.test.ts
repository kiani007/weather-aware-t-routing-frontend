import { describe, expect, it } from 'vitest'

import { createColorScale, cssGradient } from './color'

describe('createColorScale', () => {
  const scale = createColorScale([
    [0, '#000000'],
    [1, '#ffffff'],
  ])

  it('returns the stop colours at the ends', () => {
    expect(scale(0)).toEqual([0, 0, 0])
    expect(scale(1)).toEqual([255, 255, 255])
  })

  it('interpolates between stops', () => {
    expect(scale(0.5)).toEqual([128, 128, 128])
  })

  it('clamps values outside 0–1', () => {
    expect(scale(-2)).toEqual([0, 0, 0])
    expect(scale(5)).toEqual([255, 255, 255])
  })
})

describe('cssGradient', () => {
  it('builds a CSS gradient in the requested direction', () => {
    expect(cssGradient([[0, '#000'], [1, '#fff']], 'to top')).toBe('linear-gradient(to top, #000 0%, #fff 100%)')
  })
})
