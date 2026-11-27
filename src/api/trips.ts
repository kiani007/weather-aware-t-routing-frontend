import type { HeatmapData } from '@/types/heatmap'
import type { Trip, TripPlanRequest } from '@/types/trip'

import { apiClient } from './client'

export const planTrip = (payload: TripPlanRequest) => apiClient.post<Trip>('/trips/', payload)

export const fetchTrip = (tripId: string) => apiClient.get<Trip>(`/trips/${tripId}/`)

export const fetchTripHeatmap = (tripId: string, signal?: AbortSignal) =>
  apiClient.get<HeatmapData>(`/trips/${tripId}/heatmap/`, undefined, signal)
