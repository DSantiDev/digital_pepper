import { useEffect, useState } from 'react'
export function useScrollProgress(route: string) {
  const [state, setState] = useState({ progress: 0, visible: false })
  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      )
      const distance = Math.max(0, height - window.innerHeight)
      const position = Math.max(0, window.scrollY)
      const progress =
        distance > 0 ? Math.min(100, (position / distance) * 100) : 0
      const visible = distance > 0 && position > 160
      setState((previous) =>
        previous.progress === progress && previous.visible === visible
          ? previous
          : { progress, visible },
      )
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('load', schedule, true)
    const observer =
      typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null
    observer?.observe(document.documentElement)
    observer?.observe(document.body)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', schedule, true)
      observer?.disconnect()
    }
  }, [route])
  return state
}
