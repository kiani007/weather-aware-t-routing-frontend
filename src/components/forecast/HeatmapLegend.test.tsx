import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeatmapLegend } from './HeatmapLegend'

describe('HeatmapLegend', () => {
  it('lists the five risk levels plus unknown for the risk layer', () => {
    render(<HeatmapLegend metric="risk" />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Low',
      'Moderate',
      'High',
      'Severe',
      'No Travel',
      'Unknown',
    ])
    expect(screen.getByText('Low').closest('li')).toHaveAttribute('title', 'Low risk is left unshaded on the map')
  })

  it('names the measurement and its unit for weather layers', () => {
    render(<HeatmapLegend metric="wind" />)

    expect(screen.getByText('Wind (mph)')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('60+')).toBeInTheDocument()
  })

  it('shows rain as an hourly rate', () => {
    render(<HeatmapLegend metric="precipitation" />)

    expect(screen.getByText('Rain (in/hr)')).toBeInTheDocument()
  })
})
