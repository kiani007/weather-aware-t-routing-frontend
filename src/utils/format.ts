const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const shortDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export const formatDateTime = (iso: string | Date) => dateTimeFormatter.format(new Date(iso))

export const formatShortDateTime = (iso: string | Date) => shortDateTimeFormatter.format(new Date(iso))

export const formatDuration = (seconds: number) => {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours ? `${hours}h ${minutes.toString().padStart(2, '0')}m` : `${minutes}m`
}

export const formatMiles = (miles: number) => `${miles.toLocaleString(undefined, { maximumFractionDigits: 1 })} mi`

export const formatWeight = (lb: number) => `${lb.toLocaleString()} lb`

export const formatMeasure = (value: number | null, unit: string, digits = 1) =>
  value == null ? '—' : `${value.toFixed(digits)} ${unit}`

export const routeLetter = (name: string) => name.replace(/^Route\s+/, '')

const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

export const formatTime = (iso: string | Date) => timeFormatter.format(new Date(iso))

export const formatWeekday = (iso: string | Date) => weekdayFormatter.format(new Date(iso))

export const formatInches = (value: number | null) => (value == null ? '—' : `${value.toFixed(2)}"`)
