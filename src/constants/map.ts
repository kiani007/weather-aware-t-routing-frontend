import type { LatLngTuple } from '@/types/geo'

export const DEFAULT_CENTER: LatLngTuple = [39.5, -98.35]
export const DEFAULT_ZOOM = 4

export const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
export const TILE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
export const TILE_MAX_ZOOM = 16

export const ROUTE_LABEL_POSITIONS = [0.5, 0.33, 0.67, 0.25, 0.75] as const

export const ROUTE_COLORS = ['#2563eb', '#0d9488', '#9333ea', '#db2777', '#4b5563'] as const

// Extra pixels around lines and dots that still count as a click on them
export const MAP_HIT_TOLERANCE = 8

export const CHECKPOINT_RADIUS = 7
