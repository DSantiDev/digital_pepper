import { useEffect, useRef, useState } from 'react'
export const PAGE_EXIT_MS = 180
function currentRoute() {
  if (window.location.hash.startsWith('#/')) return window.location.hash
  return `#${window.location.pathname}`
}
export function usePageTransition() {
  const [route, setRoute] = useState(currentRoute)
  const [leaving, setLeaving] = useState(false)
  const current = useRef(route)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    function update() {
      // Anchor links scroll within the current page without triggering a transition.
      if (window.location.hash && !window.location.hash.startsWith('#/')) return
      const next = currentRoute()
      clearTimeout(timer)
      if (next === current.current) {
        setLeaving(false)
        return
      }
      const commit = () => {
        current.current = next
        setRoute(next)
        setLeaving(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        commit()
        return
      }
      setLeaving(true)
      timer = setTimeout(commit, PAGE_EXIT_MS)
    }
    function navigate(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor = (
        event.target as Element | null
      )?.closest<HTMLAnchorElement>('a[href]')
      if (
        !anchor ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self') ||
        anchor.getAttribute('href')?.startsWith('#')
      )
        return
      const url = new URL(anchor.href)
      if (url.origin !== window.location.origin || url.hash || url.search)
        return
      event.preventDefault()
      if (window.location.pathname !== url.pathname || window.location.hash)
        window.history.pushState(null, '', url.pathname)
      update()
    }
    document.addEventListener('click', navigate)
    window.addEventListener('hashchange', update)
    window.addEventListener('popstate', update)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', navigate)
      window.removeEventListener('hashchange', update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return { route, leaving }
}
