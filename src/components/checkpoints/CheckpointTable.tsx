import { memo } from 'react'

import { RiskLabel } from '@/components/common/RiskLabel'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
    // Titled by the surrounding tab ("Checkpoints · N"), so no heading of its own
    <section aria-label={`${routeName} checkpoints`} className="flex min-h-64 flex-1 flex-col">
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
                    {cp.risk ? (
                      <RiskLabel risk={cp.risk.key} />
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
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
