import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ScrollToTopButton } from './ScrollToTopButton'
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('innerHeight', 1000)
  vi.stubGlobal('scrollY', 0)
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
    3000,
  )
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((cb: FrameRequestCallback) => window.setTimeout(() => cb(0), 16)),
  )
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => window.clearTimeout(id)),
  )
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
function scroll(y: number) {
  act(() => {
    vi.stubGlobal('scrollY', y)
    fireEvent.scroll(window)
    vi.advanceTimersByTime(17)
  })
}
it('aparece al bajar y completa el aro según el recorrido real', () => {
  const { container } = render(<ScrollToTopButton route="#/" />)
  expect(
    screen.queryByRole('button', { name: 'Volver al inicio de la página' }),
  ).not.toBeInTheDocument()
  scroll(1000)
  expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
  expect(container.querySelector('.scroll-top-ring__value')).toHaveAttribute(
    'stroke-dashoffset',
    '50',
  )
  expect(
    screen.getByText('Has recorrido el 50% de la página.'),
  ).toBeInTheDocument()
  scroll(2000)
  expect(container.querySelector('.scroll-top-ring__value')).toHaveAttribute(
    'stroke-dashoffset',
    '0',
  )
  scroll(0)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})
it('vuelve arriba respetando la preferencia de movimiento y coloca el foco en el título', () => {
  const { container } = render(
    <>
      <div className="page-transition">
        <h1 tabIndex={-1}>Inicio</h1>
      </div>
      <ScrollToTopButton route="#/" />
    </>,
  )
  scroll(600)
  fireEvent.click(screen.getByRole('button'))
  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    left: 0,
    behavior: 'instant',
  })
  expect(screen.getByRole('heading')).toHaveFocus()
  vi.mocked(window.matchMedia).mockReturnValueOnce({
    matches: false,
  } as MediaQueryList)
  fireEvent.click(screen.getByRole('button'))
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
  expect(container.querySelector('button')).toHaveAttribute(
    'aria-describedby',
    'scroll-top-progress',
  )
})
it('recalcula al cambiar el tamaño y evita divisiones por cero en páginas cortas', () => {
  const height = vi
    .spyOn(document.documentElement, 'scrollHeight', 'get')
    .mockReturnValue(1000)
  const { container } = render(<ScrollToTopButton route="#/contacto" />)
  scroll(500)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(container.querySelector('circle[stroke-dasharray]')).toHaveAttribute(
    'stroke-dashoffset',
    '100',
  )
  height.mockReturnValue(3000)
  act(() => {
    fireEvent.resize(window)
    vi.advanceTimersByTime(17)
  })
  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(container.querySelector('circle[stroke-dasharray]')).toHaveAttribute(
    'stroke-dashoffset',
    '75',
  )
  scroll(9999)
  expect(container.querySelector('circle[stroke-dasharray]')).toHaveAttribute(
    'stroke-dashoffset',
    '0',
  )
})
it('reinicia el indicador al cambiar de página y limpia el observador', () => {
  const disconnect = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect }
    }),
  )
  const { rerender, unmount } = render(<ScrollToTopButton route="#/" />)
  scroll(1000)
  vi.stubGlobal('scrollY', 0)
  rerender(<ScrollToTopButton route="#/servicios" />)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(disconnect).toHaveBeenCalled()
  unmount()
  expect(disconnect).toHaveBeenCalledTimes(2)
})
