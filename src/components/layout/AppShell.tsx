import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks/useIsMobile'

interface AppShellProps {
  /** Desktop: everything stacked in the left sidebar */
  sidebar: ReactNode
  /** Mobile: bottom sheet under a full-height map */
  sheet: ReactNode
  main: ReactNode
}

const TITLE = 'Weather-Aware Truck Routing'

// Only one layout is mounted at a time, so the trip form is never rendered twice
export function AppShell({ sidebar, sheet, main }: AppShellProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <header className="shrink-0 border-b px-4 py-2">
          <h1 className="text-sm font-semibold tracking-tight">{TITLE}</h1>
        </header>
        <main className="relative isolate min-h-0 flex-1">{main}</main>
        {sheet}
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-row bg-background">
      <aside className="flex w-[360px] shrink-0 flex-col border-r">
        <header className="px-4 pt-4 pb-1">
          <h1 className="text-base font-semibold tracking-tight">{TITLE}</h1>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-3">{sidebar}</div>
      </aside>
      <main className="relative isolate min-h-0 flex-1">{main}</main>
    </div>
  )
}
