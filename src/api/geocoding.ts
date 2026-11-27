import type { Place } from '@/types/geo'

import { apiClient } from './client'

export const searchPlaces = (query: string, signal?: AbortSignal) =>
  apiClient.get<Place[]>('/geocoding/search/', { q: query, limit: 6 }, signal)
