import { useRef, type PointerEvent, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type SheetSnap = 'peek' | 'half' | 'full'

export interface SheetTab<Id extends string> {
  id: Id
  label: string
  content: ReactNode
  disabled?: boolean
}

interface MobileSheetProps<Id extends string> {
  tabs: SheetTab<Id>[]
  tab: Id
  onTabChange: (tab: Id) => void
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  /** Always-visible line about the current selection; tapping it expands the sheet */
  summary?: ReactNode
}

const SNAPS: SheetSnap[] = ['peek', 'half', 'full']
const SNAP_HEIGHT: Record<SheetSnap, string | undefined> = { peek: undefined, half: '48dvh', full: '85dvh' }
const DRAG_THRESHOLD_PX = 30

const step = (snap: SheetSnap, by: 1 | -1) =>
  SNAPS[Math.min(SNAPS.length - 1, Math.max(0, SNAPS.indexOf(snap) + by))] ?? snap

/**
 * Bottom sheet for small screens: the map keeps most of the screen while the trip
 * panels sit in tabs. Every panel stays mounted so switching tabs keeps form state.
 */
export function MobileSheet<Id extends string>({
  tabs,
  tab,
  onTabChange,
  snap,
  onSnapChange,
  summary,
}: MobileSheetProps<Id>) {
  const dragStart = useRef<number | null>(null)
  const expanded = snap !== 'peek'

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStart.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStart.current == null) return
    const dy = event.clientY - dragStart.current
    dragStart.current = null
    if (dy < -DRAG_THRESHOLD_PX) onSnapChange(step(snap, 1))
    else if (dy > DRAG_THRESHOLD_PX) onSnapChange(step(snap, -1))
    else onSnapChange(expanded ? 'peek' : 'half')
  }

  return (
    <section
      aria-label="Trip panel"
      className="z-[600] flex shrink-0 flex-col rounded-t-xl border-t bg-background shadow-[0_-4px_16px_rgba(15,23,42,0.08)] transition-[height] duration-200"
      style={{ height: SNAP_HEIGHT[snap] }}
    >
      <button
        type="button"
        aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
        aria-expanded={expanded}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSnapChange(expanded ? 'peek' : 'half')
          }
        }}
        className="flex h-6 w-full shrink-0 touch-none items-center justify-center"
      >
        <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
      </button>

      {summary && (
        <button
          type="button"
          onClick={() => onSnapChange(expanded ? snap : 'half')}
          className="flex w-full shrink-0 items-center gap-2 px-4 pb-2 text-left"
        >
          {summary}
        </button>
      )}

      <div role="tablist" aria-label="Trip panels" className="flex shrink-0 gap-1 border-b px-3">
        {tabs.map((item) => {
          const active = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              onClick={() => {
                onTabChange(item.id)
                if (!expanded) onSnapChange('half')
              }}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40',
                active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tabs.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          aria-label={item.label}
          hidden={!expanded || item.id !== tab}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
        >
          <div className="flex min-h-full flex-col gap-5">{item.content}</div>
        </div>
      ))}
    </section>
  )
}
