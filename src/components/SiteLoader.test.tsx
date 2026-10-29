import { act, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { SiteLoader } from './SiteLoader'
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
afterEach(() => {
  vi.useRealTimers()
  motion(true)
})
it('muestra la marca al cargar y retira la pantalla después de la salida', async () => {
  vi.useFakeTimers()
  motion(false)
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
  render(<SiteLoader />)
  expect(
    screen.getByRole('status', { name: 'Cargando Digital Pepper' }),
  ).toBeInTheDocument()
  await act(async () => {
    await vi.advanceTimersByTimeAsync(450)
  })
  expect(screen.getByRole('status')).toHaveClass('site-loader--leaving')
  await act(async () => {
    await vi.advanceTimersByTimeAsync(320)
  })
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
it('no deja bloqueado el sitio si algún recurso tarda demasiado', async () => {
  vi.useFakeTimers()
  motion(false)
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
  render(<SiteLoader />)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3820)
  })
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
