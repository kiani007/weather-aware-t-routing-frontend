import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SidebarSectionProps {
  title: string
  aside?: ReactNode
  className?: string
  children: ReactNode
}

export function SidebarSection({ title, aside, className, children }: SidebarSectionProps) {
  return (
    <section className={cn('space-y-2.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
