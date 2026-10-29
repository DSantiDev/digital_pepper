import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { useScrollHeader } from './useScrollHeader'
function scroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}
afterEach(() => scroll(0))
it('oculta al bajar y reaparece al subir, con fondo al salir del inicio', () => {
  const { result } = renderHook(() => useScrollHeader(false, '#/'))
  act(() => scroll(200))
  expect(result.current).toEqual({ hidden: true, scrolled: true })
  act(() => scroll(170))
  expect(result.current.hidden).toBe(false)
  act(() => scroll(10))
  expect(result.current).toEqual({ hidden: false, scrolled: false })
})
it('mantiene visible con el menú abierto o el foco dentro y al cambiar de página', () => {
  const { result, rerender } = renderHook(
    ({ pinned, route }) => useScrollHeader(pinned, route),
    { initialProps: { pinned: false, route: '#/' } },
  )
  act(() => scroll(200))
  expect(result.current.hidden).toBe(true)
  rerender({ pinned: true, route: '#/' })
  act(() => scroll(400))
  expect(result.current.hidden).toBe(false)
  rerender({ pinned: false, route: '#/contacto' })
  expect(result.current.hidden).toBe(false)
})
