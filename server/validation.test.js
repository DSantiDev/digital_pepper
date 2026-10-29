import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateContact, services } from './validation.js'
const valid = {
  name: '  Ana  ',
  email: 'ana@example.com',
  service: services[0],
  message: 'Quiero construir una plataforma.',
}
test('normaliza y acepta un proyecto válido', () =>
  assert.equal(validateContact(valid).data.name, 'Ana'))
for (const input of [
  null,
  [],
  {},
  { ...valid, name: 'a' },
  { ...valid, email: 'mal' },
  { ...valid, service: 'inventado' },
  { ...valid, message: 'corto' },
  { ...valid, message: 'a'.repeat(5001) },
])
  test(`rechaza datos inválidos ${JSON.stringify(input).slice(0, 100)}`, () =>
    assert.ok(validateContact(input).error))
