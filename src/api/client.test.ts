import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, apiClient } from './client'

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('apiClient', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns the parsed body and builds query strings without undefined values', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, [{ label: 'Chicago' }]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiClient.get('/geocoding/search/', { q: 'Chi', limit: undefined })).resolves.toEqual([
      { label: 'Chicago' },
    ])
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/geocoding/search/?q=Chi')
  })

  it('turns the backend error envelope into an ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(502, {
          error: { code: 'external_service_error', message: 'Open-Meteo weather rate limit reached.', request_id: 'x' },
        }),
      ),
    )

    const error = await apiClient.post('/trips/', {}).catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 502, code: 'external_service_error', message: 'Open-Meteo weather rate limit reached.' })
  })

  it('reports network failures clearly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiClient.get('/health/')).rejects.toMatchObject({ status: 0, code: 'network_error' })
  })
})
