import { Footer } from '../components/Footer'
import { serviceData } from '../data/services'
import { NotFoundPage } from './NotFoundPage'
export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = serviceData.find((item) => item[4] === slug)
  if (!service) return <NotFoundPage />
  const outcomes: Record<string, string[]> = {
    'desarrollo-medida': [
      'Arquitectura preparada para escalar',
      'Experiencias sin restricciones de plantilla',
      'Integraciones y APIs a la medida del negocio',
    ],
    'wordpress-cms': [
      'Edición simple para tu equipo',
      'Rendimiento y SEO técnico',
      'Componentes flexibles y reutilizables',
    ],
    ecommerce: [
      'UX orientada a conversión',
      'Catálogo y operación conectados',
      'Optimización continua del funnel',
    ],
    automatizaciones: [
      'Menos tareas manuales',
      'Datos conectados entre herramientas',
      'Procesos trazables y eficientes',
    ],
    branding: [
      'Posicionamiento y personalidad',
      'Sistema visual consistente',
      'Guía para crecer sin perder identidad',
    ],
    'social-media': [
      'Narrativa editorial propia',
      'Calendario y producción de contenido',
      'Aprendizaje basado en métricas',
    ],
  }
  return (
    <main className="min-h-screen bg-[#0d0912] text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro service-detail-hero mx-auto max-w-[1330px] px-5 pb-28 pt-20 sm:px-8 lg:px-14 lg:pb-40 lg:pt-32">
        <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#bb79ff]">
          Servicio {service[0]} · {service[3]}
        </span>
        <h1
          tabIndex={-1}
          className="mt-8 max-w-5xl text-[clamp(3.8rem,8vw,8rem)] font-medium leading-[.9] tracking-[-.065em]"
        >
          {service[1]}
          <span className="text-[#bd78ff]">.</span>
        </h1>
        <p className="mt-9 max-w-2xl text-xl leading-8 text-white/55">
          {service[2]}
        </p>
      </section>
      <section className="bg-[#f5f2f8] px-5 py-24 text-[#17121f] sm:px-8 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#756a7c]">
              Lo que desbloqueamos
            </span>
            <h2
              data-reveal
              className="motion-heading mt-6 text-5xl font-medium tracking-[-.05em]"
            >
              De una necesidad
              <br />a un sistema{' '}
              <span className="font-serif italic text-[#7130c5]">
                que funciona.
              </span>
            </h2>
          </div>
          <div className="divide-y divide-[#d6cedc]">
            {outcomes[slug]?.map((item, index) => (
              <div
                key={item}
                data-reveal
                className="outcome-row flex items-center gap-6 py-8"
              >
                <span className="text-xs text-[#7130c5]">0{index + 1}</span>
                <h3 className="text-2xl font-semibold">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-24 text-center lg:py-36">
        <h2
          data-reveal
          className="motion-heading text-5xl font-medium tracking-[-.05em]"
        >
          ¿Lo construimos{' '}
          <span className="font-serif italic text-[#bd78ff]">juntos?</span>
        </h2>
        <a
          href="/contacto"
          className="motion-button mt-9 inline-flex rounded-full bg-white px-7 py-4 font-semibold text-[#17101d]"
        >
          Cuéntanos tu proyecto ↗
        </a>
      </section>
      <Footer />
    </main>
  )
}
