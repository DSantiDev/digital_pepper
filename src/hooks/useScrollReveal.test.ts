import { renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useScrollReveal } from './useScrollReveal'
let fixture: HTMLDivElement | undefined
function content() {
  fixture = document.createElement('div')
  fixture.className = 'page-transition'
  fixture.innerHTML = '<article data-reveal>Contenido del servicio</article>'
  document.body.append(fixture)
  return fixture.firstElementChild as HTMLElement
}
function preference(matches: boolean) {
  const media = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
  vi.mocked(window.matchMedia).mockReturnValue(
    media as unknown as MediaQueryList,
  )
  return media
}
afterEach(() => {
  fixture?.remove()
  fixture = undefined
  vi.unstubAllGlobals()
  preference(true)
})
it('deja el contenido visible cuando no hay soporte para observar el scroll', () => {
  preference(false)
  const element = content()
  renderHook(() => useScrollReveal('#/servicios'))
  expect(element).not.toHaveAttribute('data-motion-state')
})
it('omite las entradas si el usuario prefiere movimiento reducido', () => {
  preference(true)
  const element = content()
  const constructor = vi.fn()
  vi.stubGlobal('IntersectionObserver', constructor)
  renderHook(() => useScrollReveal('#/servicios'))
  expect(constructor).not.toHaveBeenCalled()
  expect(element).not.toHaveAttribute('data-motion-state')
})
it('revela una sola vez y libera observadores y estilos al desmontar', () => {
  preference(false)
  const element = content()
  let callback: IntersectionObserverCallback
  const observe = vi.fn(),
    unobserve = vi.fn(),
    disconnect = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function (handler: IntersectionObserverCallback) {
      callback = handler
      return { observe, unobserve, disconnect }
    }),
  )
  const { unmount } = renderHook(() => useScrollReveal('#/servicios'))
  expect(observe).toHaveBeenCalledWith(element)
  expect(element.dataset.motionState).toBe('pending')
  callback!(
    [
      {
        target: element,
        isIntersecting: true,
      } as unknown as IntersectionObserverEntry,
    ],
    {} as IntersectionObserver,
  )
  expect(element.dataset.motionState).toBe('visible')
  expect(unobserve).toHaveBeenCalledWith(element)
  unmount()
  expect(disconnect).toHaveBeenCalled()
  expect(element).not.toHaveAttribute('data-motion-state')
  expect(element.style.getPropertyValue('--reveal-delay')).toBe('')
})
it('muestra todo inmediatamente si la preferencia de movimiento cambia durante la visita', () => {
  const media = preference(false)
  const element = content()
  const disconnect = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect }
    }),
  )
  renderHook(() => useScrollReveal('#/servicios'))
  expect(element.dataset.motionState).toBe('pending')
  media.matches = true
  media.addEventListener.mock.calls[0][1]()
  expect(element.dataset.motionState).toBe('visible')
  expect(disconnect).toHaveBeenCalled()
})
it('anima el bloque exterior sin duplicar efectos en títulos o tarjetas anidadas', () => {
  preference(false)
  const parent = content()
  parent.innerHTML = '<h2 data-reveal>Título</h2>'
  const observe = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe, unobserve: vi.fn(), disconnect: vi.fn() }
    }),
  )
  renderHook(() => useScrollReveal('#/servicios'))
  expect(observe).toHaveBeenCalledTimes(1)
  expect(observe).toHaveBeenCalledWith(parent)
  expect(parent.firstElementChild).not.toHaveAttribute('data-motion-state')
})
it('integra los bloques del home y los pasos del estudio con el mismo observador', () => {
  preference(false)
  content()
  fixture!.innerHTML =
    '<div class="reveal">Inicio</div><article class="process-step">Estudio</article>'
  const entries = Array.from(fixture!.children)
  let callback: IntersectionObserverCallback
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function (handler: IntersectionObserverCallback) {
      callback = handler
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
    }),
  )
  renderHook(() => useScrollReveal('#/estudio'))
  callback!(
    entries.map(
      (target) =>
        ({
          target,
          isIntersecting: true,
        }) as unknown as IntersectionObserverEntry,
    ),
    {} as IntersectionObserver,
  )
  expect(entries[0]).toHaveClass('is-visible')
  expect(entries[1]).toHaveClass('active')
})
