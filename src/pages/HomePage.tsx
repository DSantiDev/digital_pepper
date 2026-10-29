import { useEffect, useState } from 'react'
import { Arrow } from '../components/Icons'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
const rocketImage = '/images/photo-1761947951850-2468e28ffecc.jpg'
const nebulaImage = '/images/photo-1776780374903-8883c861b436.jpg'

const roles = ['Agencia', 'Estudio creativo', 'Aliado']
export function HomePage() {
  const [role, setRole] = useState(0)
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(roles[0])
      return
    }
    const target = roles[role]
    const delay = deleting ? 45 : typed === target ? 1400 : 85
    const timer = window.setTimeout(() => {
      if (!deleting && typed === target) setDeleting(true)
      else if (deleting && typed === '') {
        setDeleting(false)
        setRole((value) => (value + 1) % roles.length)
      } else setTyped(target.slice(0, typed.length + (deleting ? -1 : 1)))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [typed, deleting, role])

  return (
    <main className="overflow-hidden bg-[#0d0912] text-white">
      <section className="hero-dark relative min-h-screen">
        <img src={rocketImage} alt="" className="hero-video-placeholder" />
        <div className="hero-dark-overlay" />
        <div className="site-header-space" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-[1440px] items-center px-5 pb-24 sm:px-8 lg:px-14">
          <div className="hero-copy max-w-6xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              <span className="size-2 rounded-full bg-[#b366ff] shadow-[0_0_20px_5px_rgba(179,102,255,.5)]" />
              Estudio digital independiente
            </div>
            <h1
              tabIndex={-1}
              className="motion-title text-[clamp(3.5rem,8.5vw,8.6rem)] font-medium leading-[.9] tracking-[-0.065em]"
            >
              Somos tu
              <br />
              <span className="font-serif italic text-[#bd78ff]">{typed}</span>
              <span className="type-cursor">|</span> digital.
            </h1>
            <p className="mt-9 max-w-xl text-base leading-7 text-white/60 md:text-lg">
              Estrategia, diseño y tecnología para marcas que no quieren
              parecerse a todas las demás.
            </p>
          </div>
        </div>
        <a
          href="#metodologia"
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45"
        >
          Scroll para explorar
          <span className="scroll-line" />
        </a>
      </section>

      <section
        id="metodologia"
        className="relative bg-[#f5f2f8] px-5 py-24 text-[#17121f] sm:px-8 lg:px-14 lg:py-36"
      >
        <div className="method-glow" />
        <div className="reveal relative z-10 mx-auto grid max-w-[1330px] items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="orb absolute inset-[10%] rounded-full">
              {[
                'Ideas que escalan',
                'Experiencias memorables',
                'Diseño con propósito',
              ].map((text, index) => (
                <div key={text} className={`orbit orbit-${index + 1}`}>
                  <span>{text}</span>
                </div>
              ))}
              <div className="orb-core absolute inset-[21%] flex items-center justify-center rounded-full text-center text-white">
                <div>
                  <div className="text-[11px] uppercase tracking-[.3em] text-white/60">
                    Medir · Aprender
                  </div>
                  <div className="mt-2 font-serif text-4xl italic">Crecer</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6 text-xs font-semibold uppercase tracking-[.2em] text-[#756a7c]">
              Metodología viva
            </div>
            <h2
              data-reveal
              className="motion-heading text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[1] tracking-[-.055em]"
            >
              Cada lanzamiento es solo{' '}
              <span className="font-serif italic text-[#7130c5]">
                el comienzo.
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#675d6e]">
              No solo creamos sitios web. Medimos cómo se comportan, aprendemos
              del mercado y evolucionamos cada decisión para hacer crecer marcas
              con intención, carácter y tecnología.
            </p>
            <div className="method-steps mt-9 flex gap-8 border-t border-[#d6cedc] pt-7">
              <div>
                <strong className="text-2xl">01</strong>
                <span className="mt-1 block text-xs text-[#756a7c]">
                  Escuchar
                </span>
              </div>
              <div>
                <strong className="text-2xl">02</strong>
                <span className="mt-1 block text-xs text-[#756a7c]">
                  Construir
                </span>
              </div>
              <div>
                <strong className="text-2xl">03</strong>
                <span className="mt-1 block text-xs text-[#756a7c]">
                  Evolucionar
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2f8] px-5 pb-28 text-[#17121f] sm:px-8 lg:px-14 lg:pb-40">
        <div className="reveal mx-auto max-w-[1330px]">
          <div className="mb-12 text-xs font-semibold uppercase tracking-[.2em] text-[#756a7c]">
            01 — Nuestra forma de crear
          </div>
          <h2
            data-reveal
            className="motion-heading max-w-5xl text-[clamp(2.8rem,5.6vw,5.7rem)] font-medium leading-[1] tracking-[-.06em]"
          >
            No hacemos páginas.
            <br />
            Creamos{' '}
            <span className="font-serif italic text-[#7130c5]">
              momentum digital.
            </span>
          </h2>
          <div className="mt-16 grid border-y border-[#d6cedc] md:grid-cols-3 md:divide-x md:divide-[#d6cedc]">
            {[
              [
                'Estrategia primero',
                'Entendemos el negocio antes de diseñar una pantalla.',
                'Investigamos el contexto, la audiencia y las oportunidades para que cada proyecto nazca con una dirección clara y medible.',
              ],
              [
                'Diseño que comunica',
                'Cada decisión visual tiene una razón y un objetivo.',
                'Creamos interfaces UI/UX centradas en las personas: intuitivas, accesibles y capaces de convertir atención en acción.',
              ],
              [
                'Tecnología que crece',
                'Construimos bases sólidas para la siguiente versión.',
                'Código a medida y plataformas escalables, sin quedar atrapados en los límites de una plantilla o una solución temporal.',
              ],
            ].map((item, index) => (
              <article
                key={item[0]}
                className="motion-feature group py-10 md:px-8 first:pl-0 last:pr-0"
              >
                <span className="mb-12 flex size-10 items-center justify-center rounded-full bg-[#e8dcf4] text-xs font-semibold text-[#7130c5] transition group-hover:bg-[#7130c5] group-hover:text-white">
                  0{index + 1}
                </span>
                <h3 className="text-2xl font-semibold tracking-[-.03em]">
                  {item[0]}
                </h3>
                <p className="mt-4 font-medium leading-6">{item[1]}</p>
                <p className="mt-4 text-sm leading-6 text-[#756a7c]">
                  {item[2]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="proyectos"
        className="bg-[#0d0912] px-5 py-24 sm:px-8 lg:px-14 lg:py-36"
      >
        <div className="mx-auto max-w-[1330px]">
          <div className="reveal mb-16 grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <div className="mb-6 text-xs font-semibold uppercase tracking-[.2em] text-[#b980ec]">
                02 — Señales del futuro
              </div>
              <h2
                data-reveal
                className="motion-heading text-[clamp(2.9rem,5.5vw,5.4rem)] font-medium leading-none tracking-[-.055em]"
              >
                Ideas en
                <br />
                <span className="font-serif italic text-[#bd78ff]">
                  movimiento.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-white/55">
              Pequeños fragmentos de cómo convertimos conceptos, tecnología y
              narrativa en experiencias que se sienten vivas.
            </p>
          </div>
          <div className="bento-grid">
            <article
              className="reveal media-card bento-main group"
              style={{ backgroundImage: `url(${nebulaImage})` }}
            >
              <div className="relative z-10 mt-auto">
                <span className="mb-4 inline-flex rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                  Experiencia inmersiva
                </span>
                <h3 className="max-w-xl text-3xl font-medium md:text-4xl">
                  Lo digital también puede emocionar.
                </h3>
                <p className="mt-3 text-white/60">
                  Interfaces con ritmo y profundidad.
                </p>
              </div>
            </article>
            <article className="reveal media-card mini-card gradient-motion">
              <div className="relative z-10 mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Diseño
                </span>
                <h3 className="mt-3 text-2xl font-medium">
                  Menos ruido.
                  <br />
                  Más significado.
                </h3>
              </div>
            </article>
            <article className="reveal media-card mini-card grid-motion">
              <div className="relative z-10 mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Tecnología
                </span>
                <h3 className="mt-3 text-2xl font-medium">
                  Construido para
                  <br />
                  la siguiente etapa.
                </h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="ai-video-section relative bg-[#0d0912] px-5 pb-24 sm:px-8 lg:px-14 lg:pb-36">
        <div className="reveal ai-video mx-auto flex min-h-[55vw] max-w-[1330px] items-end overflow-hidden rounded-[2rem] p-7 sm:min-h-[580px] sm:p-12">
          <div className="ai-video-shape" />
          <div className="relative z-10">
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[.22em] text-white/55">
              Video IA · Próximamente
            </span>
            <h2
              data-reveal
              className="motion-heading max-w-4xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[.9] tracking-[-.06em]"
            >
              El futuro visual
              <br />
              de tu{' '}
              <span className="font-serif italic text-[#c17dff]">marca.</span>
            </h2>
          </div>
          <span className="absolute right-8 top-8 z-10 flex size-14 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur">
            ▶
          </span>
        </div>
      </section>
      <section
        id="contacto"
        className="cta-section universe-contact px-5 py-28 sm:px-8 lg:px-14 lg:py-40"
        style={{
          backgroundImage: `linear-gradient(rgba(13,9,18,.76), rgba(20,8,29,.92)), url(${nebulaImage})`,
        }}
      >
        <div className="reveal mx-auto grid max-w-[1330px] gap-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="mb-7 text-xs font-semibold uppercase tracking-[.2em] text-[#c796ee]">
              03 — Empecemos
            </div>
            <h2
              data-reveal
              className="motion-heading text-[clamp(3.2rem,6vw,6.5rem)] font-medium leading-[.9] tracking-[-.06em]"
            >
              ¿Listo para
              <br />
              <span className="font-serif italic text-[#c17dff]">empezar?</span>
            </h2>
            <p className="mt-7 max-w-md leading-7 text-white/55">
              Cuéntanos qué quieres construir. Nosotros te ayudamos a encontrar
              la forma más inteligente de hacerlo realidad.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
