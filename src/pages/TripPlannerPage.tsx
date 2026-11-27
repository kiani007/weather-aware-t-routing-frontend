import { useCallback, useMemo, useState } from 'react'

import { CheckpointTable } from '@/components/checkpoints/CheckpointTable'
import { ForecastBar } from '@/components/forecast/ForecastBar'
import { TabList } from '@/components/common/TabList'
import { AppShell } from '@/components/layout/AppShell'
import { MobileSheet, type SheetSnap } from '@/components/layout/MobileSheet'
import { CheckpointMarkers } from '@/components/map/CheckpointMarkers'
import { EndpointMarkers } from '@/components/map/EndpointMarkers'
import { FitBounds } from '@/components/map/FitBounds'
import { FocusedCheckpoint } from '@/components/map/FocusedCheckpoint'
import { HeatmapLayer } from '@/components/map/HeatmapLayer'
import { RouteLayers, type DecodedRoute } from '@/components/map/RouteLayers'
import { TripMap } from '@/components/map/TripMap'
import { TruckMarker } from '@/components/map/TruckMarker'
import { RecommendationNote } from '@/components/routes/RecommendationNote'
import { RouteComparison } from '@/components/routes/RouteComparison'
import { RouteSelector } from '@/components/routes/RouteSelector'
import { SelectedRouteSummary } from '@/components/routes/SelectedRouteSummary'
import { ApiError } from '@/api/client'
import { PastTripNote } from '@/components/trip-form/PastTripNote'
import { RecentTrips } from '@/components/trip-form/RecentTrips'
import { TripForm } from '@/components/trip-form/TripForm'
import { TripSummary } from '@/components/trip-form/TripSummary'
import { PLAYBACK_INTERVAL_MS } from '@/constants/heatmap'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useLoadTrip } from '@/hooks/useLoadTrip'
import { usePlanTrip } from '@/hooks/usePlanTrip'
import { useRecentTrips } from '@/hooks/useRecentTrips'
import { valuesFromTrip, type TripFormValues } from '@/hooks/useTripForm'
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

  const isMobile = useIsMobile()
  const [sheetTab, setSheetTab] = useState<PanelId>('plan')
  // Nothing to see on the map before the first plan, so the form gets the room
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('full')
  const [formOpen, setFormOpen] = useState(true)
  const [detailTab, setDetailTab] = useState<DetailTab>('compare')

  const recent = useRecentTrips()
  // Remounting the form with a new key reseeds it, e.g. with a reopened trip's values
  const [formSeed, setFormSeed] = useState<{ key: string; values?: Partial<TripFormValues> }>({ key: 'new' })

  const showTrip = (shown: Trip) => {
    setTrip(shown)
    setSelectedRouteId(shown.routes.find((route) => route.is_recommended)?.id ?? shown.routes[0]?.id ?? null)
    setFocusedSequence(null)
    playback.reset()
    recent.remember(shown)
    // Mobile: show the routes on the map, with the comparison one tap away
    setSheetTab('compare')
    setSheetSnap('peek')
    // Desktop: fold the form away so the results get the sidebar
    setFormOpen(false)
  }

  const plan = usePlanTrip(showTrip)
  const load = useLoadTrip((loaded) => {
    showTrip(loaded)
    setFormSeed({ key: loaded.id, values: valuesFromTrip(loaded) })
  })
  const [recentError, setRecentError] = useState<string>()

  const openRecent = (id: string) => {
    setRecentError(undefined)
    load.mutate(id, {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 404) {
          recent.forget(id)
          setRecentError('That trip is no longer available, so it was removed from the list.')
        } else {
          setRecentError(error.message)
        }
      },
    })
  }

  const showRecentList = () => {
    setFormOpen(true)
    setSheetTab('plan')
    setSheetSnap('full')
    requestAnimationFrame(() => document.getElementById(RECENT_TRIPS_ID)?.scrollIntoView({ block: 'start' }))
  }

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

  const focusCheckpoint = useCallback(
    (sequence: number) => {
      setFocusedSequence(sequence)
      // Mobile: drop the panel so the map can show the checkpoint
      if (isMobile) setSheetSnap('peek')
    },
    [isMobile],
  )

  const planPanel = (
    <div className="flex flex-col gap-5">
      <TripForm
        key={formSeed.key}
        initialValues={formSeed.values}
        onSubmit={plan.mutate}
        submitting={plan.isPending}
        error={plan.error?.message}
      />
      <div id={RECENT_TRIPS_ID}>
        <RecentTrips
          trips={recent.trips}
          activeTripId={trip?.id ?? null}
          loadingTripId={load.isPending ? (load.variables ?? null) : null}
          error={recentError}
          onOpen={openRecent}
          onClear={recent.clear}
        />
      </div>
    </div>
  )
  const recommendation = recommendedRoute && (
    <>
      {trip && <PastTripNote key={trip.id} trip={trip} />}
      <RecommendationNote
        route={recommendedRoute}
        selected={recommendedRoute.id === selectedRouteId}
        onSelect={selectRoute}
      />
    </>
  )
  const comparison = trip && (
    <RouteComparison routes={trip.routes} selectedRouteId={selectedRouteId} onSelect={selectRoute} />
  )
  const comparePanel = trip && (
    <>
      {recommendation}
      {comparison}
    </>
  )
  const checkpointsPanel = selectedRoute && (
    <CheckpointTable
      routeName={selectedRoute.name}
      checkpoints={selectedRoute.checkpoints}
      focusedSequence={focusedSequence}
      onFocus={focusCheckpoint}
    />
  )

  // Desktop: the form folds into a one-line summary after planning; the recommendation
  // stays visible, and comparison and checkpoints share the remaining height as tabs
  const formHidden = Boolean(trip) && !formOpen
  const checkpointsLabel = selectedRoute ? `Checkpoints · ${selectedRoute.checkpoints.length}` : 'Checkpoints'
  const sidebar = (
    <>
      {trip && formHidden && (
        <TripSummary
          trip={trip}
          onEdit={() => setFormOpen(true)}
          onShowRecent={recent.trips.length ? showRecentList : undefined}
        />
      )}
      {trip && formOpen && (
        <button
          type="button"
          onClick={() => setFormOpen(false)}
          className="self-end text-xs text-muted-foreground hover:text-foreground"
        >
          Hide form
        </button>
      )}
      <div hidden={formHidden}>{planPanel}</div>
      {recommendation}
      {trip && (
        <div className="flex min-h-0 flex-1 flex-col">
          <TabList<DetailTab>
            label="Route details"
            tabs={[
              { id: 'compare', label: 'Compare' },
              { id: 'checkpoints', label: checkpointsLabel, disabled: !selectedRoute },
            ]}
            tab={detailTab}
            onSelect={setDetailTab}
          />
          <div role="tabpanel" aria-label="Compare" hidden={detailTab !== 'compare'} className="pt-3">
            {comparison}
          </div>
          <div
            role="tabpanel"
            aria-label="Checkpoints"
            hidden={detailTab !== 'checkpoints'}
            className="flex min-h-0 flex-1 flex-col pt-3"
          >
            {checkpointsPanel}
          </div>
        </div>
      )}
    </>
  )

  const sheet = (
    <MobileSheet<PanelId>
      tabs={[
        { id: 'plan', label: 'Plan', content: planPanel },
        { id: 'compare', label: 'Compare', content: comparePanel, disabled: !trip },
        { id: 'checkpoints', label: checkpointsLabel, content: checkpointsPanel, disabled: !selectedRoute },
      ]}
      tab={sheetTab}
      onTabChange={setSheetTab}
      snap={sheetSnap}
      onSnapChange={setSheetSnap}
      summary={selectedRoute && <SelectedRouteSummary route={selectedRoute} />}
    />
  )

  const main = (
    <>
      <TripMap>
        {heatmap.data && <HeatmapLayer data={heatmap.data} metric={metric} hour={hour} />}
        {trip && (
          <>
            <FitBounds points={allPoints} />
            <RouteLayers routes={decodedRoutes} selectedRouteId={selectedRouteId} onSelect={selectRoute} />
            {selectedRoute && <CheckpointMarkers key={selectedRoute.id} route={selectedRoute} />}
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

  return <AppShell sidebar={sidebar} sheet={sheet} main={main} />
}

const RECENT_TRIPS_ID = 'recent-trips'

type PanelId = 'plan' | 'compare' | 'checkpoints'
type DetailTab = 'compare' | 'checkpoints'

function describeTruck(trip: Trip | null, route: RouteOption | null, time: Date | null, enRoute: boolean): string {
  if (!trip || !route || !time) return ''
  if (enRoute) return `Estimated position on ${route.name}`
  return time < new Date(trip.departure_at) ? 'Before departure' : `Arrived via ${route.name}`
}
