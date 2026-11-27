import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import type { Place } from '@/types/geo'

import { PlaceAutocomplete } from './PlaceAutocomplete'

const denver: Place = { label: 'Denver, Colorado, United States', lat: 39.74, lon: -104.99 }

function Harness() {
  const [place, setPlace] = useState<Place | null>(denver)
  return (
    <QueryClientProvider client={new QueryClient()}>
      <PlaceAutocomplete id="destination" value={place} onChange={setPlace} placeholder="Enter your destination" />
    </QueryClientProvider>
  )
}

describe('PlaceAutocomplete', () => {
  it('keeps the first typed character when replacing a selected place', async () => {
    render(<Harness />)
    const input = screen.getByRole('combobox')

    await userEvent.clear(input)
    await userEvent.type(input, 'Denver')

    expect(input).toHaveValue('Denver')
  })

  it('keeps the first character when typing over a selected place', async () => {
    render(<Harness />)
    const input = screen.getByRole('combobox')

    await userEvent.tripleClick(input)
    await userEvent.keyboard('Chicago')

    expect(input).toHaveValue('Chicago')
  })
})
