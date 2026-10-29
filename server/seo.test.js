import { test } from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from './app.js'
import { normalizeSiteUrl, robots, sitemap, routes } from './seo.js'
test('sitemap con URLs absolutas limpias y robots con referencia al dominio configurado', () => {
  const xml = sitemap('https://agencia.example/')
  assert.equal((xml.match(/<loc>/g) || []).length, 11)
  for (const route of routes)
    assert.ok(xml.includes(`<loc>https://agencia.example${route}</loc>`))
  assert.ok(!xml.includes('#/'))
  assert.match(
    robots('https://agencia.example'),
    /Sitemap: https:\/\/agencia.example\/sitemap.xml/,
  )
  assert.match(robots('https://agencia.example'), /Disallow: \/api\//)
  for (const invalid of [
    'javascript:alert(1)',
    'https://user:pass@example.com',
    'https://example.com/subruta',
    'https://example.com?x=1',
  ])
    assert.throws(() => normalizeSiteUrl(invalid))
})
test('sirve robots, sitemap y las once rutas al abrir o recargar directamente', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pepper-seo-'))
  await writeFile(
    join(dir, 'index.html'),
    '<html><body>Digital Pepper</body></html>',
  )
  const app = createApp({
    store: { save() {} },
    publicDir: dir,
    siteUrl: 'https://agencia.example',
  })
  app.listen(0, '127.0.0.1')
  await once(app, 'listening')
  const base = `http://127.0.0.1:${app.address().port}`
  try {
    for (const route of routes) {
      const res = await fetch(base + route)
      assert.equal(res.status, 200)
      assert.match(res.headers.get('content-type'), /text\/html/)
      assert.match(await res.text(), /Digital Pepper/)
    }
    const xml = await fetch(base + '/sitemap.xml')
    assert.match(xml.headers.get('content-type'), /application\/xml/)
    assert.equal(await xml.text(), sitemap('https://agencia.example'))
    const txt = await fetch(base + '/robots.txt')
    assert.match(txt.headers.get('content-type'), /text\/plain/)
    assert.equal(await txt.text(), robots('https://agencia.example'))
    assert.equal(
      await (await fetch(base + '/sitemap.xml', { method: 'HEAD' })).text(),
      '',
    )
    assert.equal(
      (await fetch(base + '/sitemap.xml', { method: 'POST' })).status,
      405,
    )
    assert.equal((await fetch(base + '/no-existe')).status, 404)
  } finally {
    await new Promise((resolve) => app.close(resolve))
    await rm(dir, { recursive: true })
  }
})
test('sin dominio usa el origen local de la petición, sin fijar un dominio ficticio', async () => {
  const app = createApp({ store: { save() {} } })
  app.listen(0, '127.0.0.1')
  await once(app, 'listening')
  const base = `http://127.0.0.1:${app.address().port}`
  try {
    assert.equal(await (await fetch(base + '/robots.txt')).text(), robots(base))
    assert.ok(
      (await (await fetch(base + '/sitemap.xml')).text()).includes(
        `<loc>${base}/</loc>`,
      ),
    )
  } finally {
    await new Promise((resolve) => app.close(resolve))
  }
})
