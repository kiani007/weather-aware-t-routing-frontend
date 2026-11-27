import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TabList } from './TabList'

const tabs = [
  { id: 'compare', label: 'Compare' },
  { id: 'checkpoints', label: 'Checkpoints · 42' },
  { id: 'later', label: 'Later', disabled: true },
] as const

describe('TabList', () => {
  it('marks the active tab and reports clicks', async () => {
    const onSelect = vi.fn()
    render(<TabList label="Route details" tabs={[...tabs]} tab="compare" onSelect={onSelect} />)

    expect(screen.getByRole('tablist', { name: 'Route details' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Compare' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'Checkpoints · 42' }))
    expect(onSelect).toHaveBeenCalledWith('checkpoints')
  })

  it('does not select disabled tabs', async () => {
    const onSelect = vi.fn()
    render(<TabList label="Route details" tabs={[...tabs]} tab="compare" onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('tab', { name: 'Later' }))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
