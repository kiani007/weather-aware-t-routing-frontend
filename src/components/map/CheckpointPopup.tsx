import { RiskBadge } from '@/components/common/RiskBadge'
import type { Checkpoint } from '@/types/trip'
import { formatDateTime, formatMeasure } from '@/utils/format'

export function CheckpointPopup({ routeName, checkpoint: cp }: { routeName: string; checkpoint: Checkpoint }) {
  return (
    <div className="min-w-48 space-y-1.5 text-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-slate-900">
          {routeName} · mile {Math.round(cp.mile_marker)}
        </span>
        {cp.risk && <RiskBadge risk={cp.risk.key} />}
      </div>
      <p className="text-slate-600">ETA {formatDateTime(cp.eta)}</p>
      {cp.risk ? (
        <dl className="grid grid-cols-3 gap-1 text-slate-700">
          <div>
            <dt className="text-slate-400">Wind</dt>
            <dd>{formatMeasure(cp.wind_mph, 'mph', 0)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Rain</dt>
            <dd>{formatMeasure(cp.rain_in_hr, 'in/h', 2)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Snow</dt>
            <dd>{formatMeasure(cp.snow_in_hr, 'in/h', 2)}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-amber-700">Weather unknown: no forecast available for this ETA.</p>
      )}
      {cp.reasons.length > 0 && cp.risk && (
        <ul className="list-disc pl-4 text-slate-600">
          {cp.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
