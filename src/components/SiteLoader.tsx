import { useEffect, useState } from 'react'
export function SiteLoader() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'done'>('loading')
  useEffect(() => {
    let cancelled = false
    let exitTimer: ReturnType<typeof setTimeout>
    let minimumTimer: ReturnType<typeof setTimeout>
    let maximumTimer: ReturnType<typeof setTimeout>
    let loadListener: (() => void) | undefined
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            loadListener = resolve
            window.addEventListener('load', loadListener, { once: true })
          })
    const minimum = new Promise<void>((resolve) => {
      minimumTimer = setTimeout(resolve, reduced ? 0 : 450)
    })
    const maximum = new Promise<void>((resolve) => {
      maximumTimer = setTimeout(resolve, 3500)
    })
    Promise.race([
      Promise.all([
        loaded,
        document.fonts?.ready ?? Promise.resolve(),
        minimum,
      ]),
      maximum,
    ]).then(() => {
      if (cancelled) return
      if (reduced) {
        setPhase('done')
        return
      }
      setPhase('leaving')
      exitTimer = setTimeout(() => setPhase('done'), 320)
    })
    return () => {
      cancelled = true
      clearTimeout(exitTimer)
      clearTimeout(minimumTimer)
      clearTimeout(maximumTimer)
      if (loadListener) window.removeEventListener('load', loadListener)
    }
  }, [])
  if (phase === 'done') return null
  return (
    <div
      className={`site-loader site-loader--${phase}`}
      role="status"
      aria-label="Cargando Digital Pepper"
    >
      <div className="site-loader-brand">
        <span className="logo-mark logo-light">
          <span />
          <span />
          <span />
        </span>
        <span>Digital Pepper</span>
      </div>
      <span className="site-loader-caption">
        Diseño con intención. Código con carácter.
      </span>
      <span className="site-loader-track" aria-hidden="true">
        <span />
      </span>
      <span className="sr-only">Cargando sitio web…</span>
    </div>
  )
}
