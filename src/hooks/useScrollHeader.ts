import { useEffect, useState } from 'react'
export function useScrollHeader(pinned: boolean, route: string) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let previous = Math.max(0, window.scrollY)
    setHidden(false)
    setScrolled(previous > 24)
    function update() {
      const next = Math.max(0, window.scrollY)
      setScrolled(next > 24)
      if (pinned || next < 120) {
        setHidden(false)
        previous = next
        return
      }
      const delta = next - previous
      if (Math.abs(delta) < 6) return
      setHidden(delta > 0)
      previous = next
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pinned, route])
  return { hidden, scrolled }
}
