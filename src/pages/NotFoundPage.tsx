import { Footer } from '../components/Footer'
export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#0d0912] text-white">
      <div className="site-header-space" aria-hidden="true" />
      <section className="page-intro mx-auto max-w-5xl px-5 py-32">
        <h1 tabIndex={-1} className="text-5xl">
          Página no encontrada
        </h1>
        <a className="mt-8 inline-block text-[#bd78ff]" href="/">
          Volver al inicio ↗
        </a>
      </section>
      <Footer />
    </main>
  )
}
