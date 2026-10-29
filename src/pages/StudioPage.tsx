import { Footer } from '../components/Footer'
const cultureImages = [
  '/images/photo-1725273571396-a0d8c04199ec.jpg',
  '/images/photo-1713464050974-9245669e7c05.jpg',
  '/images/photo-1626968534584-ab373fd8556c.jpg',
]

export function StudioPage() {
  const milestones = [
    [
      'Descubrir',
      'Empezamos con preguntas, no con respuestas. Escuchamos al equipo, estudiamos el contexto y encontramos el problema que realmente vale la pena resolver.',
    ],
    [
      'Dar forma',
      'Convertimos hallazgos en una dirección clara. Prototipamos temprano, contrastamos ideas y construimos un lenguaje visual con intención.',
    ],
    [
      'Construir y aprender',
      'Desarrollamos por capas, medimos el comportamiento real y usamos cada dato para mejorar la siguiente iteración.',
    ],
  ]

  return (
    <main className="min-h-screen bg-[#0d0912] text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro mx-auto max-w-[1330px] px-5 pb-24 pt-20 sm:px-8 lg:px-14 lg:pb-36 lg:pt-32">
        <div className="mb-8 text-xs font-semibold uppercase tracking-[.22em] text-[#bb79ff]">
          El estudio · Cómo pensamos
        </div>
        <h1
          tabIndex={-1}
          className="motion-title text-[clamp(3.8rem,8vw,8rem)] font-medium leading-[.9] tracking-[-.065em]"
        >
          Conoce a<br />
          <span className="font-serif italic text-[#bd78ff]">
            Digital Pepper.
          </span>
        </h1>
        <p className="mt-9 max-w-2xl text-xl leading-8 text-white/55">
          Más que una agencia, tu partner tecnológico. Un equipo pequeño por
          decisión, multidisciplinario por naturaleza.
        </p>
      </section>
      <section className="bg-[#f5f2f8] px-5 py-24 text-[#17121f] sm:px-8 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[.7fr_1.3fr]">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="text-xs font-semibold uppercase tracking-[.2em] text-[#756a7c]">
              Proceso creativo
            </div>
            <h2
              data-reveal
              className="motion-heading mt-6 text-5xl font-medium tracking-[-.05em]"
            >
              De la curiosidad
              <br />a algo{' '}
              <span className="font-serif italic text-[#7130c5]">real.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-7 text-[#756a7c]">
              No es una receta rígida. Es un sistema vivo que se adapta a cada
              reto sin perder dirección.
            </p>
          </div>
          <div className="timeline process-timeline">
            {milestones.map((item, index) => (
              <article key={item[0]} className="timeline-item process-step">
                <span className="timeline-node">{index + 1}</span>
                <span className="text-xs font-semibold uppercase tracking-[.15em] text-[#8d8194]">
                  Paso 0{index + 1}
                </span>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-.04em]">
                  {item[0]}
                </h3>
                <p className="mt-5 max-w-xl text-lg leading-8 text-[#6f6576]">
                  {item[1]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[1330px]">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[.2em] text-[#bb79ff]">
                Cultura Pepper
              </div>
              <h2
                data-reveal
                className="motion-heading mt-6 text-5xl font-medium tracking-[-.05em]"
              >
                Curiosidad,
                <br />
                <span className="font-serif italic text-[#bd78ff]">
                  sin ego.
                </span>
              </h2>
            </div>
            <div>
              <p className="text-2xl leading-9 text-white/75">
                Las mejores ideas no necesitan una jerarquía. Necesitan un
                equipo dispuesto a preguntar, compartir y cambiar de opinión
                cuando aparece una solución mejor.
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {[
                  [
                    '01',
                    'Hablamos claro',
                    'Sin jerga innecesaria ni procesos escondidos.',
                  ],
                  [
                    '02',
                    'Compartimos temprano',
                    'Una idea mejora cuando más perspectivas la desafían.',
                  ],
                  [
                    '03',
                    'Aprendemos siempre',
                    'Cada proyecto deja herramientas para el siguiente.',
                  ],
                ].map((value) => (
                  <div key={value[0]} data-reveal className="culture-value">
                    <span>{value[0]}</span>
                    <strong>{value[1]}</strong>
                    <p>{value[2]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="culture-grid mt-16">
            {cultureImages.map((image, index) => (
              <img
                data-reveal
                key={image}
                src={image}
                alt={
                  index === 0
                    ? 'Equipo creativo colaborando en el estudio'
                    : 'Detrás de escena de Digital Pepper'
                }
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
