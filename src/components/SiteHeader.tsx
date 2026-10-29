import { useEffect, useRef, useState } from 'react'
import { useScrollHeader } from '../hooks/useScrollHeader'
import { Arrow, Chevron } from './Icons'
import { serviceLinks, serviceSlugs } from '../data/services'
const links = [
  ['Proyectos', '#/proyectos'],
  ['El estudio', '#/estudio'],
  ['Contacto', '#/contacto'],
]
export function SiteHeader({ route }: { route: string }) {
  const [focusWithin, setFocusWithin] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { hidden, scrolled } = useScrollHeader(
    servicesOpen || mobileOpen || focusWithin,
    route,
  )
  const servicesActive =
    route === '#/servicios' || route.startsWith('#/servicios/')
  const header = useRef<HTMLElement>(null)
  const servicesButton = useRef<HTMLButtonElement>(null)
  const mobileButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setServicesOpen(false)
    setMobileOpen(false)
  }, [route])
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) {
        setServicesOpen(false)
        setMobileOpen(false)
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (servicesOpen) {
        setServicesOpen(false)
        servicesButton.current?.focus()
      } else if (mobileOpen) {
        setMobileOpen(false)
        mobileButton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [servicesOpen, mobileOpen])
  function close() {
    setServicesOpen(false)
    setMobileOpen(false)
  }
  return (
    <header
      ref={header}
      className={`site-header fixed inset-x-0 top-0 z-50 text-white${hidden ? ' site-header--hidden' : ''}${scrolled ? ' site-header--scrolled' : ''}`}
      inert={hidden}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setFocusWithin(false)
      }}
    >
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14 lg:py-7">
        <a
          href="/"
          onClick={close}
          className="brand-link flex items-center gap-3"
          aria-label="Digital Pepper, inicio"
        >
          <span className="logo-mark logo-light">
            <span />
            <span />
            <span />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.03em]">
            Digital Pepper
          </span>
        </a>
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 rounded-full border border-white/10 bg-[#120d18]/60 px-7 py-3.5 text-sm font-medium shadow-2xl backdrop-blur-xl lg:flex"
        >
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setServicesOpen(false)
            }}
          >
            <button
              type="button"
              ref={servicesButton}
              className="motion-nav-link flex items-center gap-1.5 transition hover:text-[#bb79ff]"
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              aria-controls="services-navigation"
              data-active={servicesActive || undefined}
            >
              Servicios <Chevron />
            </button>
            {servicesOpen && (
              <div
                id="services-navigation"
                className="absolute left-1/2 top-9 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#181020] p-2 shadow-2xl"
              >
                <a
                  href="/servicios"
                  onClick={close}
                  aria-current={route === '#/servicios' ? 'page' : undefined}
                  className="mb-1 flex items-center justify-between rounded-xl border-b border-white/10 px-4 py-3 font-semibold text-[#c28aff] hover:bg-white/5"
                >
                  Todos los servicios <Arrow className="size-4" />
                </a>
                {serviceLinks.map((item, index) => (
                  <a
                    key={item}
                    href={`/servicios/${serviceSlugs[index]}`}
                    onClick={close}
                    aria-current={
                      route === `#/servicios/${serviceSlugs[index]}`
                        ? 'page'
                        : undefined
                    }
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/70 hover:bg-white/5 hover:text-[#c28aff]"
                  >
                    {item}
                    <Arrow className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href.slice(1)}
              onClick={close}
              aria-current={route === href ? 'page' : undefined}
              className="motion-nav-link transition hover:text-[#bb79ff]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="/contacto"
          onClick={close}
          className="motion-button hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#17101d] transition hover:-translate-y-0.5 hover:bg-[#a85aef] hover:text-white lg:flex"
        >
          Hablemos <Arrow className="size-4" />
        </a>
        <button
          type="button"
          ref={mobileButton}
          className="menu-toggle flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-px w-5 bg-white" />
            <span className="h-px w-5 bg-white" />
          </span>
        </button>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="mobile-navigation mx-5 grid gap-1 rounded-2xl border border-white/10 bg-[#17101d] p-3 font-medium shadow-xl lg:hidden"
        >
          <a
            href="/servicios"
            aria-current={route === '#/servicios' ? 'page' : undefined}
            data-active={servicesActive || undefined}
            onClick={close}
            className="rounded-xl px-4 py-3 text-[#c28aff] hover:bg-white/5"
          >
            Todos los servicios
          </a>
          {serviceLinks.map((item, index) => (
            <a
              key={item}
              href={`/servicios/${serviceSlugs[index]}`}
              aria-current={
                route === `#/servicios/${serviceSlugs[index]}`
                  ? 'page'
                  : undefined
              }
              onClick={close}
              className="rounded-xl px-4 py-2 text-sm text-white/65 hover:bg-white/5"
            >
              {item}
            </a>
          ))}
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href.slice(1)}
              onClick={close}
              aria-current={route === href ? 'page' : undefined}
              className="rounded-xl px-4 py-3 hover:bg-white/5"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
