import { useEffect } from 'react'
/** One-shot entrances. Content remains visible when motion or observers are unavailable. */
export function useScrollReveal(route: string) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches || !('IntersectionObserver' in window)) return
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.page-transition :is([data-reveal], .reveal, .process-step)',
      ),
    )
    // Animate outer blocks once; avoid compounded transforms on nested content.
    const targets = elements.filter(
      (element) =>
        !element.parentElement?.closest(
          '[data-reveal], .reveal, .process-step',
        ),
    )
    function show(element: HTMLElement) {
      element.dataset.motionState = 'visible'
      if (element.classList.contains('reveal'))
        element.classList.add('is-visible')
      if (element.classList.contains('process-step'))
        element.classList.add('active')
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    )
    targets.forEach((element, index) => {
      element.dataset.motionState = 'pending'
      element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`)
      observer.observe(element)
    })
    function reduceMotion() {
      if (!preference.matches) return
      observer.disconnect()
      targets.forEach(show)
    }
    preference.addEventListener('change', reduceMotion)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', reduceMotion)
      targets.forEach((element) => {
        delete element.dataset.motionState
        element.style.removeProperty('--reveal-delay')
      })
    }
  }, [route])
}
