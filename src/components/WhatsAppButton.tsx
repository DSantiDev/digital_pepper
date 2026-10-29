export function whatsappUrl(phone: string): string | null {
  // wa.me requires an international number containing digits only.
  if (!/^\+?[\d\s().-]+$/.test(phone.trim())) return null
  const digits = phone.replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null
  const message =
    'Hola, me gustaría recibir más información sobre sus servicios.'
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
export function WhatsAppButton({
  phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? '',
}: {
  phone?: string
}) {
  const url = whatsappUrl(phone)
  return (
    <aside className="whatsapp-widget" aria-label="Contacto rápido">
      <a
        className="whatsapp-fab"
        href={url ?? '/contacto'}
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
        aria-label={
          url
            ? 'Escríbenos por WhatsApp (abre una pestaña nueva)'
            : 'Escríbenos: ir al formulario de contacto'
        }
        aria-describedby="whatsapp-tooltip"
      >
        <span className="whatsapp-fab__halo" aria-hidden="true" />
        <span className="whatsapp-fab__surface" aria-hidden="true">
          <img src="/icons/whatsapp.svg" width="30" height="30" alt="" />
        </span>
        <span id="whatsapp-tooltip" role="tooltip" className="whatsapp-tooltip">
          <strong>¿Necesitas más información?</strong>
          <span>
            Escríbenos <span aria-hidden="true">↗</span>
          </span>
        </span>
      </a>
    </aside>
  )
}
