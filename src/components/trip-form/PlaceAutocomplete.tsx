import { useId, useState, type KeyboardEvent } from 'react'

import { Spinner } from '@/components/common/Spinner'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { usePlaceSearch } from '@/hooks/usePlaceSearch'
import type { Place } from '@/types/geo'

interface PlaceAutocompleteProps {
  id: string
  value: Place | null
  onChange: (place: Place | null) => void
  placeholder: string
  invalid?: boolean
}

export function PlaceAutocomplete({ id, value, onChange, placeholder, invalid }: PlaceAutocompleteProps) {
  const listId = useId()
  const [text, setText] = useState(value?.label ?? '')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [syncedLabel, setSyncedLabel] = useState(value?.label)
  const { data: places = [], isFetching, isError } = usePlaceSearch(open ? text : '')

  if (value?.label !== syncedLabel) {
    setSyncedLabel(value?.label)
    setText(value?.label ?? '')
  }

  const select = (place: Place) => {
    onChange(place)
    setText(place.label)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || places.length === 0) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + delta + places.length) % places.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const place = places[activeIndex]
      if (place) select(place)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && text.trim().length >= 3

  return (
    <div className="relative">
      <Input
        id={id}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        aria-invalid={invalid}
        className="pr-8"
        onChange={(event) => {
          setText(event.target.value)
          setOpen(true)
          setActiveIndex(0)
          if (value) onChange(null)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
      />
      {isFetching && <Spinner className="absolute top-2 right-2.5 size-4 text-muted-foreground" />}
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-[1000] mt-1 max-h-64 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {isError && <li className="px-3 py-2 text-sm text-destructive">Search failed. Try again.</li>}
          {!isError && places.length === 0 && !isFetching && (
            <li className="px-3 py-2 text-sm text-muted-foreground">No matches found.</li>
          )}
          {places.map((place, index) => (
            <li
              key={`${place.label}-${place.lat}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => {
                event.preventDefault()
                select(place)
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn('cursor-pointer rounded-md px-2 py-1.5 text-sm', index === activeIndex && 'bg-accent')}
            >
              {place.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
