import names from '../shared/services.json' with { type: 'json' }
export const services = names
export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { error: 'Datos inválidos.' }
  const data = Object.fromEntries(
    ['name', 'email', 'service', 'message'].map((key) => [
      key,
      typeof input[key] === 'string' ? input[key].trim() : '',
    ]),
  )
  if (data.name.length < 2 || data.name.length > 100)
    return { error: 'El nombre debe tener entre 2 y 100 caracteres.' }
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { error: 'Ingresa un email válido.' }
  if (!services.includes(data.service))
    return { error: 'Selecciona un tipo de proyecto válido.' }
  if (data.message.length < 10 || data.message.length > 5000)
    return { error: 'El mensaje debe tener entre 10 y 5000 caracteres.' }
  return { data }
}
