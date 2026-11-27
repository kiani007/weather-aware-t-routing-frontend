import type { Trip } from '@/types/trip'

/** What the browser remembers about a trip it planned; the full trip is fetched by id on demand. */
export interface RecentTrip {
  id: string
  origin_label: string
  destination_label: string
  departure_at: string
  load_weight_lb: number
  recommended_route: string | null
  planned_at: string
}

export const RECENT_TRIPS_KEY = 'watr.recentTrips'
export const MAX_RECENT_TRIPS = 10

export function summarizeTrip(trip: Trip): RecentTrip {
  return {
    id: trip.id,
    origin_label: trip.origin_label,
    destination_label: trip.destination_label,
    departure_at: trip.departure_at,
    load_weight_lb: trip.load_weight_lb,
    recommended_route: trip.routes.find((route) => route.is_recommended)?.name ?? null,
    planned_at: trip.created_at,
  }
}

// Storage can be unavailable (private mode, blocked site data); history is a convenience, so fail quietly
export function readRecentTrips(): RecentTrip[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECENT_TRIPS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isRecentTrip).slice(0, MAX_RECENT_TRIPS) : []
  } catch {
    return []
  }
}

export function writeRecentTrips(trips: RecentTrip[]): void {
  try {
    window.localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify(trips.slice(0, MAX_RECENT_TRIPS)))
  } catch {
    // ignore: the list simply won't survive a reload
  }
}

/** Newest first, without duplicates, capped at MAX_RECENT_TRIPS. */
export function addRecentTrip(trips: RecentTrip[], trip: RecentTrip): RecentTrip[] {
  return [trip, ...trips.filter((item) => item.id !== trip.id)].slice(0, MAX_RECENT_TRIPS)
}

function isRecentTrip(value: unknown): value is RecentTrip {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.origin_label === 'string' &&
    typeof item.destination_label === 'string' &&
    typeof item.departure_at === 'string'
  )
}
