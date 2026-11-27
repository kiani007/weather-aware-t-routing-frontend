import { memo } from 'react'
import { CircleMarker, Popup } from 'react-leaflet'

import { RISK_STYLES } from '@/constants/risk'
import type { RouteOption } from '@/types/trip'

import { CheckpointPopup } from './CheckpointPopup'

interface CheckpointMarkersProps {
  route: RouteOption
  emphasized: boolean
}

export const CheckpointMarkers = memo(function CheckpointMarkers({ route, emphasized }: CheckpointMarkersProps) {
  return route.checkpoints.map((cp) => {
    const color = cp.has_forecast ? RISK_STYLES[cp.risk.key].color : '#94a3b8'
    return (
      <CircleMarker
        key={`${route.id}-${cp.sequence}`}
        center={[cp.lat, cp.lon]}
        radius={emphasized ? 5.5 : 2}
        pathOptions={{
          color: '#fff',
          weight: emphasized ? 1.5 : 0,
          fillColor: color,
          fillOpacity: emphasized ? 1 : 0.35,
        }}
      >
        <Popup>
          <CheckpointPopup routeName={route.name} checkpoint={cp} />
        </Popup>
      </CircleMarker>
    )
  })
})
