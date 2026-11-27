const pad = (n: number) => n.toString().padStart(2, '0')

/** Value for <input type="datetime-local"> in the browser's local timezone. */
export const toLocalInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`

export const nextHalfHour = (from = new Date()) => {
  const date = new Date(from)
  date.setMinutes(date.getMinutes() < 30 ? 30 : 60, 0, 0)
  return date
}

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 86_400_000)

export const addHours = (iso: string, hours: number) => new Date(new Date(iso).getTime() + hours * 3_600_000)
