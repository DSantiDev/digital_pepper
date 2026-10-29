import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ContactForm } from './ContactForm'
afterEach(() => vi.unstubAllGlobals())
async function fill() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nombre'), 'Ana')
  await user.type(screen.getByLabelText('Email'), 'ana@example.com')
  await user.selectOptions(
    screen.getByLabelText('Tipo de proyecto'),
    'Branding',
  )
  await user.type(
    screen.getByLabelText('Mensaje'),
    'Quiero una nueva identidad.',
  )
  return user
}
describe('Contacto', () => {
  it('envía los datos y confirma recepción', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Enviar proyecto' }))
    await screen.findByText('Recibimos tu proyecto. Gracias por escribirnos.')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Ana',
          email: 'ana@example.com',
          service: 'Branding',
          message: 'Quiero una nueva identidad.',
        }),
      }),
    )
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })
  it('muestra error y conserva los datos para reintentar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Sin conexión')))
    render(<ContactForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Enviar proyecto' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Sin conexión'),
    )
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
  })
  it('bloquea doble envío mientras espera', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
    render(<ContactForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Enviar proyecto' }))
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
  })
})
