import { useSyncExternalStore } from 'react'

export const MOBILE_QUERY = '(max-width: 767px)'

const media = () => (typeof window.matchMedia === 'function' ? window.matchMedia(MOBILE_QUERY) : null)

function subscribe(onChange: () => void) {
  const query = media()
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}

/** True below Tailwind's `md` breakpoint; updates when the viewport crosses it. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => media()?.matches ?? false,
    () => false,
  )
}
