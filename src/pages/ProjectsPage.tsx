import { Footer } from '../components/Footer'
import { Arrow } from '../components/Icons'
export function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0d0912] text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro mx-auto max-w-[1330px] px-5 pb-20 pt-20 sm:px-8 lg:px-14 lg:pb-28 lg:pt-32">
        <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#bb79ff]">
          Proyectos seleccionados
        </span>
        <h1
          tabIndex={-1}
          className="mt-8 text-[clamp(3.8rem,8vw,8rem)] font-medium leading-[.9] tracking-[-.065em]"
        >
          Trabajo con
          <br />
          <span className="font-serif italic text-[#bd78ff]">carácter.</span>
        </h1>
        <p className="mt-9 max-w-xl text-lg leading-8 text-white/55">
          Una colección en construcción de productos, identidades y experiencias
          digitales diseñadas para mover negocios.
        </p>
      </section>
      <section className="px-5 pb-32 sm:px-8 lg:px-14">
        <div className="project-grid mx-auto max-w-[1330px]">
          {[
            ['Producto digital', 'Nébula / Plataforma'],
            ['E-commerce', 'Origen / Retail'],
            ['Identidad & Web', 'Norte / Estudio'],
          ].map((project, index) => (
            <article
              key={project[1]}
              data-reveal
              className={`project-card project-card-${index + 1}`}
            >
              <span>{project[0]}</span>
              <h2 className="motion-heading">{project[1]}</h2>
              <Arrow className="size-6" />
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
