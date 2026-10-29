import { useScrollProgress } from '../hooks/useScrollProgress'
export function ScrollToTopButton({ route }: { route: string }) {
  const { progress, visible } = useScrollProgress(route)
  function returnToTop() {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduced ? 'instant' : 'smooth',
    })
    document
      .querySelector<HTMLElement>('.page-transition h1')
      ?.focus({ preventScroll: true })
  }
  return (
    <div
      className={`scroll-top-widget${visible ? ' scroll-top-widget--visible' : ''}`}
    >
      <button
        type="button"
        className="scroll-top-button"
        onClick={returnToTop}
        aria-label="Volver al inicio de la página"
        aria-describedby="scroll-top-progress"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <svg
          className="scroll-top-ring"
          width="62"
          height="62"
          viewBox="0 0 62 62"
          fill="none"
          aria-hidden="true"
        >
          <circle className="scroll-top-ring__track" cx="31" cy="31" r="27" />
          <circle
            className="scroll-top-ring__value"
            cx="31"
            cy="31"
            r="27"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
          />
        </svg>
        <svg
          className="scroll-top-arrow"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 19V5m-6 6 6-6 6 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="scroll-top-tooltip" aria-hidden="true">
          Volver arriba
        </span>
      </button>
      <span id="scroll-top-progress" className="sr-only">
        Has recorrido el {Math.round(progress)}% de la página.
      </span>
    </div>
  )
}
