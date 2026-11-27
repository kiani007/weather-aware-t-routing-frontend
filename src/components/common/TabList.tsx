import { cn } from '@/lib/utils'

export interface TabItem<Id extends string> {
  id: Id
  label: string
  disabled?: boolean
}

interface TabListProps<Id extends string> {
  tabs: TabItem<Id>[]
  tab: Id
  onSelect: (tab: Id) => void
  label: string
  className?: string
}

/** Underlined tab bar shared by the desktop sidebar and the mobile panel. */
export function TabList<Id extends string>({ tabs, tab, onSelect, label, className }: TabListProps<Id>) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex shrink-0 gap-1 border-b', className)}>
      {tabs.map((item) => {
        const active = item.id === tab
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40',
              active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
