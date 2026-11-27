import { memo } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RISK_STYLES } from '@/constants/risk'
import type { Checkpoint } from '@/types/trip'
import { formatInches, formatMeasure, formatTime, formatWeekday } from '@/utils/format'

interface CheckpointTableProps {
  routeName: string
  checkpoints: Checkpoint[]
  focusedSequence: number | null
  onFocus: (sequence: number) => void
}

export const CheckpointTable = memo(function CheckpointTable({
  routeName,
  checkpoints,
  focusedSequence,
  onFocus,
}: CheckpointTableProps) {
  return (
    <section aria-label={`${routeName} checkpoints`} className="flex min-h-64 flex-1 flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Checkpoints · {checkpoints.length}
      </h2>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border">
        <Table className="text-[11px] [&_td]:px-1.5 [&_td]:py-1.5 [&_th]:h-8 [&_th]:px-1.5">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>Mile</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Wind</TableHead>
              <TableHead>Rain</TableHead>
              <TableHead>Snow</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkpoints.map((cp, index) => {
              const previous = checkpoints[index - 1]
              const newDay = !previous || formatWeekday(previous.eta) !== formatWeekday(cp.eta)
              const risk = RISK_STYLES[cp.risk.key]
              return (
                <TableRow
                  key={cp.sequence}
                  onClick={() => onFocus(cp.sequence)}
                  title={cp.reasons.join('\n') || undefined}
                  data-state={focusedSequence === cp.sequence ? 'selected' : undefined}
                  className="cursor-pointer tabular-nums"
                >
                  <TableCell>{Math.round(cp.mile_marker)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {newDay && <span className="text-muted-foreground">{formatWeekday(cp.eta)} </span>}
                    {formatTime(cp.eta)}
                  </TableCell>
                  <TableCell>{formatMeasure(cp.wind_mph, 'mph', 0)}</TableCell>
                  <TableCell>{formatInches(cp.rain_in_hr)}</TableCell>
                  <TableCell>{formatInches(cp.snow_in_hr)}</TableCell>
                  <TableCell>
                    {cp.has_forecast ? (
                      <span className="flex items-center gap-1 font-medium whitespace-nowrap" style={{ color: risk.color }}>
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: risk.color }} />
                        {risk.label}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">n/a</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  )
})
