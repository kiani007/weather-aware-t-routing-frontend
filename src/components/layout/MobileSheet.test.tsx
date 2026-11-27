import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { MobileSheet, type SheetSnap } from './MobileSheet'

function Harness({ initialSnap = 'half' as SheetSnap, checkpointsDisabled = false }) {
  const [tab, setTab] = useState<'plan' | 'compare' | 'checkpoints'>('plan')
  const [snap, setSnap] = useState<SheetSnap>(initialSnap)
  return (
    <MobileSheet
      tabs={[
        { id: 'plan', label: 'Plan', content: <input aria-label="Origin" /> },
        { id: 'compare', label: 'Compare', content: <p>Route table</p> },
        { id: 'checkpoints', label: 'Checkpoints', content: <p>Checkpoint list</p>, disabled: checkpointsDisabled },
      ]}
      tab={tab}
      onTabChange={setTab}
      snap={snap}
      onSnapChange={setSnap}
      summary={<span>Route A · 17h 48m</span>}
    />
  )
}

describe('MobileSheet', () => {
  it('shows only the active panel', async () => {
    render(<Harness />)

    expect(screen.getByLabelText('Origin')).toBeVisible()
    await userEvent.click(screen.getByRole('tab', { name: 'Compare' }))

    expect(screen.getByRole('tab', { name: 'Compare' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Route table')).toBeVisible()
    expect(screen.getByLabelText('Origin')).not.toBeVisible()
  })

  it('keeps hidden panels mounted so form input survives tab switches', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByLabelText('Origin'), 'Chicago')
    await userEvent.click(screen.getByRole('tab', { name: 'Compare' }))
    await userEvent.click(screen.getByRole('tab', { name: 'Plan' }))

    expect(screen.getByLabelText('Origin')).toHaveValue('Chicago')
  })

  it('collapses to the summary and expands when a tab or the summary is tapped', async () => {
    render(<Harness initialSnap="peek" />)

    expect(screen.getByText('Route A · 17h 48m')).toBeVisible()
    expect(screen.getByLabelText('Origin')).not.toBeVisible()
    expect(screen.getByRole('button', { name: 'Expand panel' })).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(screen.getByText('Route A · 17h 48m'))
    expect(screen.getByLabelText('Origin')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Collapse panel' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('disables tabs that have nothing to show yet', () => {
    render(<Harness checkpointsDisabled />)

    expect(screen.getByRole('tab', { name: 'Checkpoints' })).toBeDisabled()
  })
})
