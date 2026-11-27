import { memo } from 'react'
import { CircleMarker, Popup } from 'react-leaflet'

import { CHECKPOINT_RADIUS } from '@/constants/map'
import { RISK_STYLES } from '@/constants/risk'
import type { RouteOption } from '@/types/trip'

import { CheckpointPopup } from './CheckpointPopup'

// Rendered only for the selected route: where routes share a road, dots from
// several routes would stack and the wrong one would catch the click.
// Remount (key by route id) after the route lines so the dots draw on top.
export const CheckpointMarkers = memo(function CheckpointMarkers({ route }: { route: RouteOption }) {
  return route.checkpoints.map((cp) => {
    const color = cp.has_forecast ? RISK_STYLES[cp.risk.key].color : '#94a3b8'
    return (
      <CircleMarker
        key={`${route.id}-${cp.sequence}`}
        center={[cp.lat, cp.lon]}
        radius={CHECKPOINT_RADIUS}
        pathOptions={{ color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 }}
      >
        <Popup>
          <CheckpointPopup routeName={route.name} checkpoint={cp} />
        </Popup>
      </CircleMarker>
    )
  })
})
