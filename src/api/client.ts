import type { ApiErrorBody } from '@/types/api'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

type QueryParams = Record<string, string | number | undefined>

async function request<T>(path: string, init: RequestInit = {}, params?: QueryParams): Promise<T> {
  const query = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).flatMap(([key, value]) => (value === undefined ? [] : [[key, String(value)]])),
      ).toString()
    : ''

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}${query}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'network_error', 'Unable to reach the server. Check your connection.')
  }

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = (body as ApiErrorBody | null)?.error
    throw new ApiError(response.status, error?.code ?? 'http_error', error?.message ?? response.statusText, error?.details)
  }
  return body as T
}

export const apiClient = {
  get: <T>(path: string, params?: QueryParams, signal?: AbortSignal) => request<T>(path, { signal }, params),
  post: <T>(path: string, data: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
}
