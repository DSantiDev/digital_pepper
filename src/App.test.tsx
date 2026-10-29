import { render, screen, fireEvent } from '@testing-library/react'
import { it, expect } from 'vitest'
import App from './App'
it('resuelve servicios y rechaza slugs inexistentes', () => {
  window.location.hash = '#/servicios/branding'
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Branding',
  )
  window.location.hash = '#/servicios/no-existe'
  fireEvent(window, new Event('hashchange'))
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Página no encontrada',
  )
})
it('navega desde el menú móvil', () => {
  window.location.hash = '#/contacto'
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
  expect(
    screen.getByRole('navigation', { name: 'Navegación móvil' }),
  ).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar menú' }))
  expect(
    screen.queryByRole('navigation', { name: 'Navegación móvil' }),
  ).not.toBeInTheDocument()
})
