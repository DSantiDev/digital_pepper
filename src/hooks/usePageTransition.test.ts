import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { PAGE_EXIT_MS, usePageTransition } from './usePageTransition'
function motion(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    () =>
      ({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}
function navigate(hash: string) {
  window.history.replaceState(null, '', hash)
  window.dispatchEvent(new Event('hashchange'))
}
afterEach(() => {
  vi.useRealTimers()
  motion(true)
})
it('desvanece la página anterior antes de mostrar la nueva y reinicia el scroll', () => {
  vi.useFakeTimers()
  motion(false)
  window.history.replaceState(null, '', '#/')
  const { result } = renderHook(usePageTransition)
  act(() => navigate('#/servicios'))
  expect(result.current).toEqual({ route: '#/', leaving: true })
  act(() => vi.advanceTimersByTime(PAGE_EXIT_MS))
  expect(result.current).toEqual({ route: '#/servicios', leaving: false })
  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    left: 0,
    behavior: 'instant',
  })
})
it('conserva el último destino al navegar rápidamente', () => {
  vi.useFakeTimers()
  motion(false)
  window.history.replaceState(null, '', '#/')
  const { result } = renderHook(usePageTransition)
  act(() => navigate('#/proyectos'))
  act(() => vi.advanceTimersByTime(80))
  act(() => navigate('#/contacto'))
  act(() => vi.advanceTimersByTime(PAGE_EXIT_MS))
  expect(result.current.route).toBe('#/contacto')
})
it('omite la espera con movimiento reducido y conserva los enlaces a secciones', () => {
  window.history.replaceState(null, '', '#/')
  const { result } = renderHook(usePageTransition)
  act(() => navigate('#metodologia'))
  expect(result.current.route).toBe('#/')
  act(() => navigate('#/estudio'))
  expect(result.current).toEqual({ route: '#/estudio', leaving: false })
  act(() => navigate('#contenido'))
  expect(result.current.route).toBe('#/estudio')
})
it('cancela la transición si se regresa a la página visible', () => {
  vi.useFakeTimers()
  motion(false)
  window.history.replaceState(null, '', '#/')
  const { result } = renderHook(usePageTransition)
  act(() => navigate('#/proyectos'))
  act(() => navigate('#/'))
  act(() => vi.advanceTimersByTime(PAGE_EXIT_MS))
  expect(result.current).toEqual({ route: '#/', leaving: false })
})
it('resuelve URLs limpias y responde a Atrás/Adelante', () => {
  window.history.replaceState(null, '', '/servicios/branding')
  const { result } = renderHook(usePageTransition)
  expect(result.current.route).toBe('#/servicios/branding')
  act(() => {
    window.history.replaceState(null, '', '/proyectos')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(result.current.route).toBe('#/proyectos')
})
