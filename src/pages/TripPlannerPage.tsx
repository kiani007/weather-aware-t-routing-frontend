import { useCallback, useMemo, useState } from 'react'

import { CheckpointTable } from '@/components/checkpoints/CheckpointTable'
import { ForecastBar } from '@/components/forecast/ForecastBar'
import { AppShell } from '@/components/layout/AppShell'
import { CheckpointMarkers } from '@/components/map/CheckpointMarkers'
import { EndpointMarkers } from '@/components/map/EndpointMarkers'
import { FitBounds } from '@/components/map/FitBounds'
import { FocusedCheckpoint } from '@/components/map/FocusedCheckpoint'
import { HeatmapLayer } from '@/components/map/HeatmapLayer'
import { RouteLayers, type DecodedRoute } from '@/components/map/RouteLayers'
import { TripMap } from '@/components/map/TripMap'
import { TruckMarker } from '@/components/map/TruckMarker'
import { RecommendationNote } from '@/components/routes/RecommendationNote'
import { RouteSelector } from '@/components/routes/RouteSelector'
import { RouteSummary } from '@/components/routes/RouteSummary'
import { TripForm } from '@/components/trip-form/TripForm'
import { PLAYBACK_INTERVAL_MS } from '@/constants/heatmap'
import { usePlanTrip } from '@/hooks/usePlanTrip'
import { usePlayback } from '@/hooks/usePlayback'
import { useTripHeatmap } from '@/hooks/useTripHeatmap'
import type { HeatmapMetric } from '@/types/heatmap'
import type { RouteOption, Trip } from '@/types/trip'
import { addHours } from '@/utils/datetime'
import { decodePolyline, positionAt } from '@/utils/geo'

const FORECAST_HOURS = 48

export function TripPlannerPage() {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)
  const [focusedSequence, setFocusedSequence] = useState<number | null>(null)
  const [metric, setMetric] = useState<HeatmapMetric>('risk')
  const playback = usePlayback(FORECAST_HOURS, PLAYBACK_INTERVAL_MS)
  const hour = playback.step

  const heatmap = useTripHeatmap(trip?.id)

  const plan = usePlanTrip((planned) => {
    setTrip(planned)
    setSelectedRouteId(planned.routes.find((route) => route.is_recommended)?.id ?? planned.routes[0]?.id ?? null)
    setFocusedSequence(null)
    playback.reset()
  })

  const decodedRoutes = useMemo<DecodedRoute[]>(
    () => trip?.routes.map((route) => ({ route, path: decodePolyline(route.polyline) })) ?? [],
    [trip],
  )
  const allPoints = useMemo(() => decodedRoutes.flatMap((route) => route.path), [decodedRoutes])

  const selectedRoute = trip?.routes.find((route) => route.id === selectedRouteId) ?? null
  const recommendedRoute = trip?.routes.find((route) => route.is_recommended) ?? null
  const focusedCheckpoint = selectedRoute?.checkpoints.find((cp) => cp.sequence === focusedSequence) ?? null

  const forecastStart = heatmap.data?.start ?? trip?.departure_at
  const forecastTime = forecastStart ? addHours(forecastStart, hour) : null
  const truckPosition = selectedRoute && forecastTime ? positionAt(selectedRoute.checkpoints, forecastTime) : null
  const truckStatus = describeTruck(trip, selectedRoute, forecastTime, truckPosition !== null)

  const selectRoute = useCallback((routeId: number) => {
    setSelectedRouteId(routeId)
    setFocusedSequence(null)
  }, [])

  const sidebar = (
    <>
      <TripForm onSubmit={plan.mutate} submitting={plan.isPending} error={plan.error?.message} />
      {recommendedRoute && <RecommendationNote route={recommendedRoute} />}
      {selectedRoute && <RouteSummary route={selectedRoute} />}
      {selectedRoute && (
        <CheckpointTable
          routeName={selectedRoute.name}
          checkpoints={selectedRoute.checkpoints}
          focusedSequence={focusedSequence}
          onFocus={setFocusedSequence}
        />
      )}
    </>
  )

  const main = (
    <>
      <TripMap>
        {heatmap.data && <HeatmapLayer data={heatmap.data} metric={metric} hour={hour} />}
        {trip && (
          <>
            <FitBounds points={allPoints} />
            <RouteLayers routes={decodedRoutes} selectedRouteId={selectedRouteId} onSelect={selectRoute} />
            {trip.routes.map((route) => (
              <CheckpointMarkers key={route.id} route={route} emphasized={route.id === selectedRouteId} />
            ))}
            <EndpointMarkers origin={trip.origin} destination={trip.destination} />
            <FocusedCheckpoint checkpoint={focusedCheckpoint} />
            <TruckMarker position={truckPosition} label={truckStatus} />
          </>
        )}
      </TripMap>
      {trip && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex p-3 pr-14 md:justify-center">
          <RouteSelector routes={trip.routes} selectedRouteId={selectedRouteId} onSelect={selectRoute} />
        </div>
      )}
      {trip && forecastTime && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex justify-center p-3 pb-9 md:pb-6">
          <ForecastBar
            hour={hour}
            maxHour={FORECAST_HOURS}
            time={forecastTime}
            metric={metric}
            playing={playback.playing}
            loading={heatmap.isLoading}
            error={heatmap.error?.message}
            onHourChange={playback.seek}
            onMetricChange={setMetric}
            onTogglePlay={playback.toggle}
          />
        </div>
      )}
    </>
  )

  return <AppShell sidebar={sidebar} main={main} />
}

function describeTruck(trip: Trip | null, route: RouteOption | null, time: Date | null, enRoute: boolean): string {
  if (!trip || !route || !time) return ''
  if (enRoute) return `Estimated position on ${route.name}`
  return time < new Date(trip.departure_at) ? 'Before departure' : `Arrived via ${route.name}`
}
