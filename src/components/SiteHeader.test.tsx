import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from '../App'
it('mantiene el mismo nav del home al cambiar de página e incluye el listado de servicios', () => {
  window.history.replaceState(null, '', '#/')
  render(<App />)
  const header = screen.getByRole('banner')
  const nav = screen.getByRole('navigation', { name: 'Navegación principal' })
  fireEvent.click(within(nav).getByRole('button', { name: 'Servicios' }))
  expect(
    within(nav).getByRole('link', { name: 'Todos los servicios' }),
  ).toHaveAttribute('href', '/servicios')
  expect(within(nav).getByRole('link', { name: 'Branding' })).toHaveAttribute(
    'href',
    '/servicios/branding',
  )
  window.history.replaceState(null, '', '#/servicios')
  fireEvent(window, new Event('hashchange'))
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Soluciones digitales',
  )
  expect(screen.getByRole('banner')).toBe(header)
  expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBe(
    nav,
  )
  expect(
    within(nav).getByRole('button', { name: 'Servicios' }),
  ).toHaveAttribute('aria-expanded', 'false')
})
it('cierra el desplegable con Escape o un clic fuera y permite acceder a todos los servicios en móvil', () => {
  window.history.replaceState(null, '', '#/contacto')
  render(<App />)
  const services = screen.getByRole('button', { name: 'Servicios' })
  fireEvent.click(services)
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(services).toHaveFocus()
  expect(services).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(services)
  fireEvent.pointerDown(document.body)
  expect(services).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
  const mobile = screen.getByRole('navigation', { name: 'Navegación móvil' })
  expect(
    within(mobile).getByRole('link', { name: 'Todos los servicios' }),
  ).toHaveAttribute('href', '/servicios')
  expect(
    within(mobile).getByRole('link', { name: 'Branding' }),
  ).toHaveAttribute('href', '/servicios/branding')
  fireEvent.click(
    within(mobile).getByRole('link', { name: 'Todos los servicios' }),
  )
  expect(
    screen.queryByRole('navigation', { name: 'Navegación móvil' }),
  ).not.toBeInTheDocument()
})
it('resalta Servicios también en sus detalles y anuncia la página activa en móvil', () => {
  window.history.replaceState(null, '', '/servicios/branding')
  render(<App />)
  expect(screen.getByRole('button', { name: 'Servicios' })).toHaveAttribute(
    'data-active',
    'true',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
  const mobile = screen.getByRole('navigation', { name: 'Navegación móvil' })
  expect(
    within(mobile).getByRole('link', { name: 'Branding' }),
  ).toHaveAttribute('aria-current', 'page')
  fireEvent.click(within(mobile).getByRole('link', { name: 'Proyectos' }))
  expect(window.location.pathname).toBe('/proyectos')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Trabajo con',
  )
  expect(
    within(
      screen.getByRole('navigation', { name: 'Navegación principal' }),
    ).getByRole('link', { name: 'Proyectos' }),
  ).toHaveAttribute('aria-current', 'page')
})
