import { useCallback, useEffect, useState } from 'react'

export function usePlayback(maxStep: number, intervalMs: number) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStep((current) => (current >= maxStep ? 0 : current + 1)), intervalMs)
    return () => window.clearInterval(timer)
  }, [playing, maxStep, intervalMs])

  const toggle = useCallback(() => setPlaying((value) => !value), [])
  const seek = useCallback((value: number) => {
    setPlaying(false)
    setStep(value)
  }, [])

  return { step, playing, toggle, seek, reset: () => seek(0) }
}
