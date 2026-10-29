import { test } from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createApp } from './app.js'
const valid = {
  name: 'Ana',
  email: 'ana@example.com',
  service: 'Branding',
  message: 'Necesito una nueva identidad.',
}
async function withServer(options, run) {
  const app = createApp({ store: { save: () => 'test-id' }, ...options })
  app.listen(0, '127.0.0.1')
  await once(app, 'listening')
  try {
    await run(`http://127.0.0.1:${app.address().port}`)
  } finally {
    await new Promise((resolve) => app.close(resolve))
  }
}
const post = (base, data, headers = {}) =>
  fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  })
test('crea un contacto validado y responde sin exponer datos personales', () =>
  withServer({}, async (base) => {
    const res = await post(base, valid)
    assert.equal(res.status, 201)
    assert.deepEqual(await res.json(), {
      id: 'test-id',
      message: 'Proyecto recibido.',
    })
  }))
test('rechaza JSON inválido, validación, contenido incorrecto y origen externo', () =>
  withServer({ rateLimit: 20 }, async (base) => {
    assert.equal((await post(base, '{')).status, 400)
    assert.equal((await post(base, {})).status, 422)
    assert.equal(
      (await post(base, valid, { 'Content-Type': 'text/plain' })).status,
      415,
    )
    assert.equal(
      (await post(base, valid, { Origin: 'https://evil.example' })).status,
      403,
    )
    assert.equal((await post(base, 'a'.repeat(33000))).status, 413)
    assert.equal((await fetch(`${base}/api/contact`)).status, 405)
    assert.equal((await fetch(`${base}/api/missing`)).status, 404)
  }))
test('limita intentos repetidos', () =>
  withServer({ rateLimit: 1 }, async (base) => {
    assert.equal((await post(base, valid)).status, 201)
    const res = await post(base, valid)
    assert.equal(res.status, 429)
    assert.ok(res.headers.get('Retry-After'))
  }))
test('informa fallos de persistencia sin filtrar detalles internos', () =>
  withServer(
    {
      store: {
        save() {
          throw new Error('secret')
        },
      },
      logger: { error() {} },
    },
    async (base) => {
      const res = await post(base, valid)
      assert.equal(res.status, 500)
      assert.ok(!(await res.text()).includes('secret'))
    },
  ))
