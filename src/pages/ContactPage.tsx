import { Footer } from '../components/Footer'
import { ContactForm } from '../components/ContactForm'
export function ContactPage() {
  return (
    <main className="contact-page min-h-screen text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro mx-auto grid max-w-[1330px] gap-16 px-5 pb-28 pt-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-14 lg:pb-40 lg:pt-32">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#c796ee]">
            Contacto
          </span>
          <h1
            tabIndex={-1}
            className="mt-8 text-[clamp(3.8rem,7vw,7rem)] font-medium leading-[.9] tracking-[-.065em]"
          >
            Hagamos algo
            <br />
            <span className="font-serif italic text-[#bd78ff]">
              extraordinario.
            </span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-8 text-white/55">
            Cuéntanos dónde estás y hacia dónde quieres ir. Te responderemos con
            preguntas, ideas y un próximo paso claro.
          </p>
          <div className="mt-10 text-sm text-white/40">
            hola@digitalpepper.co
            <br />
            Bogotá · Trabajamos globalmente
          </div>
        </div>
        <ContactForm />
      </section>
      <Footer />
    </main>
  )
}
