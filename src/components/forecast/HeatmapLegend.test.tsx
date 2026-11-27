import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeatmapLegend } from './HeatmapLegend'

describe('HeatmapLegend', () => {
  it('lists the five risk levels for the risk layer', () => {
    render(<HeatmapLegend metric="risk" />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Low',
      'Moderate',
      'High',
      'Severe',
      'No Travel',
    ])
  })

  it('shows the scale range and unit for weather layers', () => {
    render(<HeatmapLegend metric="wind" />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('60+ mph')).toBeInTheDocument()
  })
})
