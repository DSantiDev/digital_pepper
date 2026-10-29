import { useState, type FormEvent } from 'react'
import { Arrow } from './Icons'
import { serviceLinks } from '../data/services'
import { submitContact } from '../lib/contact'
export function ContactForm() {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    setMessage('')
    try {
      await submitContact({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        service: String(data.get('service') ?? ''),
        message: String(data.get('message') ?? ''),
      })
      setStatus('success')
      setMessage('Recibimos tu proyecto. Gracias por escribirnos.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar. Intenta de nuevo.',
      )
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-busy={status === 'sending'}
    >
      <label data-reveal>
        <span>Nombre</span>
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Tu nombre o empresa"
        />
      </label>
      <label data-reveal>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="hola@empresa.com"
        />
      </label>
      <label data-reveal>
        <span>Tipo de proyecto</span>
        <select name="service" required defaultValue="">
          <option value="" disabled>
            Selecciona una opción
          </option>
          {serviceLinks.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </label>
      <label data-reveal>
        <span>Mensaje</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          placeholder="Háblanos brevemente de tu idea"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="motion-button cta-button mt-4 inline-flex w-fit items-center gap-4 rounded-full bg-[#8a3ed1] px-7 py-4 font-semibold text-white"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar proyecto'}
        <Arrow className="size-5" />
      </button>
      <p
        className="form-feedback"
        role={status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  )
}
