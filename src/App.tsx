import { useEffect, useRef } from 'react'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { SiteHeader } from './components/SiteHeader'
import { WhatsAppButton } from './components/WhatsAppButton'
import { SiteLoader } from './components/SiteLoader'
import { useScrollReveal } from './hooks/useScrollReveal'
import { usePageTransition } from './hooks/usePageTransition'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { StudioPage } from './pages/StudioPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  const { route, leaving } = usePageTransition()
  useScrollReveal(route)
  const firstRender = useRef(true)
  useEffect(() => {
    document.title = `${route.includes('contacto') ? 'Contacto · ' : ''}Digital Pepper`
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document
      .querySelector<HTMLElement>('.page-transition h1')
      ?.focus({ preventScroll: true })
  }, [route])
  return (
    <div className="app-shell">
      <SiteHeader route={route} />
      <div
        className={`page-transition${leaving ? ' page-transition--leaving' : ''}`}
        aria-busy={leaving}
      >
        <div key={route} className="page-transition-enter">
          <Page route={route} />
        </div>
      </div>
      <ScrollToTopButton route={route} />
      <WhatsAppButton />
      <SiteLoader />
    </div>
  )
}
function Page({ route }: { route: string }) {
  if (route.startsWith('#/servicios/'))
    return <ServiceDetailPage key={route} slug={route.slice(12)} />
  switch (route) {
    case '#/servicios':
      return <ServicesPage />
    case '#/proyectos':
      return <ProjectsPage />
    case '#/estudio':
      return <StudioPage />
    case '#/contacto':
      return <ContactPage />
    case '':
    case '#':
    case '#/':
    case '#metodologia':
      return <HomePage />
    default:
      return <NotFoundPage />
  }
}
