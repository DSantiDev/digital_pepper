import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { WhatsAppButton, whatsappUrl } from './WhatsAppButton'
it('abre el número internacional con el mensaje de consulta y sin acceso a la pestaña original', () => {
  render(<WhatsAppButton phone="+57 (300) 123-4567" />)
  const link = screen.getByRole('link', {
    name: 'Escríbenos por WhatsApp (abre una pestaña nueva)',
  })
  const url = new URL(link.getAttribute('href')!)
  expect(url.origin).toBe('https://wa.me')
  expect(url.pathname).toBe('/573001234567')
  expect(url.searchParams.get('text')).toBe(
    'Hola, me gustaría recibir más información sobre sus servicios.',
  )
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  expect(link).toHaveAttribute('aria-describedby', 'whatsapp-tooltip')
  expect(screen.getByRole('tooltip')).toHaveTextContent(
    '¿Necesitas más información?Escríbenos',
  )
})
it('no inventa un número cuando falta configuración y permite contactar por el formulario', () => {
  render(<WhatsAppButton phone="" />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', '/contacto')
  expect(link).not.toHaveAttribute('target')
})
it('rechaza números incompletos y valores que no sean teléfonos', () => {
  for (const value of [
    '',
    '123',
    '0'.repeat(12),
    '1'.repeat(16),
    'https://evil.example',
    '+57 300 alert(1)',
  ])
    expect(whatsappUrl(value)).toBeNull()
})
