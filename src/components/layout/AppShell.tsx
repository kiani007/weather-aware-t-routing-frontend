import type { ReactNode } from 'react'

interface AppShellProps {
  sidebar: ReactNode
  main: ReactNode
}

export function AppShell({ sidebar, main }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col bg-background md:flex-row">
      <aside className="flex max-h-[45dvh] w-full shrink-0 flex-col border-b md:max-h-none md:w-[360px] md:border-r md:border-b-0">
        <header className="px-4 pt-4 pb-1">
          <h1 className="text-base font-semibold tracking-tight">Weather-Aware Truck Routing</h1>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-3">{sidebar}</div>
      </aside>
      <main className="relative isolate min-h-0 flex-1">{main}</main>
    </div>
  )
}
