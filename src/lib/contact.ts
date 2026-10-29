export interface ContactInput {
  name: string
  email: string
  service: string
  message: string
}
export async function submitContact(input: ContactInput): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? 'No se pudo enviar. Intenta de nuevo.')
  }
}
