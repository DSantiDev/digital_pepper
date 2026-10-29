import { Footer } from '../components/Footer'
import { serviceData } from '../data/services'
import { Arrow } from '../components/Icons'
export function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0d0912] text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro mx-auto max-w-[1330px] px-5 pb-24 pt-20 sm:px-8 lg:px-14 lg:pb-36 lg:pt-32">
        <div className="mb-8 text-xs font-semibold uppercase tracking-[.22em] text-[#bb79ff]">
          Servicios · Consultoría & desarrollo
        </div>
        <h1
          tabIndex={-1}
          className="max-w-5xl text-[clamp(3.8rem,8vw,8rem)] font-medium leading-[.9] tracking-[-.065em]"
        >
          Soluciones digitales
          <br />
          que <span className="font-serif italic text-[#bd78ff]">escalan.</span>
        </h1>
        <p className="mt-9 max-w-2xl text-lg leading-8 text-white/55">
          Seis disciplinas, una sola visión: convertir objetivos de negocio en
          experiencias digitales relevantes, útiles y preparadas para crecer.
        </p>
      </section>
      <section className="bg-[#f5f2f8] px-5 py-24 text-[#17121f] sm:px-8 lg:px-14 lg:py-36">
        <div className="services-bento mx-auto max-w-[1330px]">
          {serviceData.map((service, index) => (
            <a
              href={`/servicios/${service[4]}`}
              key={service[0]}
              data-reveal
              className={`service-block group service-block-${index + 1}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-[#7130c5]">
                  {service[0]}
                </span>
                <Arrow className="size-6 transition group-hover:rotate-45" />
              </div>
              <div className="mt-auto">
                <span className="mb-5 block text-[10px] uppercase tracking-[.18em] text-[#817489]">
                  {service[3]}
                </span>
                <h2
                  data-reveal
                  className="motion-heading text-3xl font-semibold tracking-[-.04em] lg:text-4xl"
                >
                  {service[1]}
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-[#6f6576]">
                  {service[2]}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
