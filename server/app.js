import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { normalizeSiteUrl, sitemap, robots, routes } from './seo.js'
import { validateContact } from './validation.js'
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}
function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}
export function createApp({
  store,
  publicDir = resolve('dist'),
  siteUrl,

  rateLimit = 5,
  windowMs = 60000,
  logger = console,
}) {
  const configuredOrigin = siteUrl ? normalizeSiteUrl(siteUrl) : null
  const clients = new Map()
  const root = resolve(publicDir)
  return createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('X-Frame-Options', 'DENY')
    try {
      const url = new URL(req.url, 'http://localhost')
      if (['/sitemap.xml', '/robots.txt'].includes(url.pathname)) {
        if (!['GET', 'HEAD'].includes(req.method)) {
          res.setHeader('Allow', 'GET, HEAD')
          return json(res, 405, { error: 'Método no permitido.' })
        }
        const origin =
          configuredOrigin ?? normalizeSiteUrl(`http://${req.headers.host}`)
        const isSitemap = url.pathname === '/sitemap.xml'
        res.writeHead(200, {
          'Content-Type': isSitemap
            ? 'application/xml; charset=utf-8'
            : 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        })
        return res.end(
          req.method === 'HEAD'
            ? undefined
            : isSitemap
              ? sitemap(origin)
              : robots(origin),
        )
      }
      if (url.pathname === '/api/health' && req.method === 'GET')
        return json(res, 200, { status: 'ok' })
      if (url.pathname === '/api/contact') {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST')
          return json(res, 405, { error: 'Método no permitido.' })
        }
        if (
          req.headers['sec-fetch-site'] === 'cross-site' ||
          (req.headers.origin &&
            req.headers.origin !== `http://${req.headers.host}` &&
            req.headers.origin !== `https://${req.headers.host}`)
        )
          return json(res, 403, { error: 'Origen no permitido.' })
        if (
          !req.headers['content-type']
            ?.toLowerCase()
            .startsWith('application/json')
        )
          return json(res, 415, { error: 'Se requiere application/json.' })
        const now = Date.now()
        for (const [key, entry] of clients)
          if (entry.until <= now) clients.delete(key)
        const ip = req.socket.remoteAddress
        const client = clients.get(ip) ?? { count: 0, until: now + windowMs }
        if (client.count >= rateLimit) {
          res.setHeader(
            'Retry-After',
            String(Math.ceil((client.until - now) / 1000)),
          )
          return json(res, 429, {
            error: 'Demasiados intentos. Intenta de nuevo en un minuto.',
          })
        }
        client.count++
        clients.set(ip, client)
        let size = 0
        const chunks = []
        for await (const chunk of req) {
          size += chunk.length
          if (size > 32768)
            return json(res, 413, {
              error: 'El formulario es demasiado grande.',
            })
          chunks.push(chunk)
        }
        let input
        try {
          input = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        } catch {
          return json(res, 400, { error: 'JSON inválido.' })
        }
        const result = validateContact(input)
        if (result.error) return json(res, 422, { error: result.error })
        const id = await store.save(result.data)
        return json(res, 201, { id, message: 'Proyecto recibido.' })
      }
      if (url.pathname.startsWith('/api/'))
        return json(res, 404, { error: 'Ruta no encontrada.' })
      if (!['GET', 'HEAD'].includes(req.method))
        return json(res, 405, { error: 'Método no permitido.' })
      let pathname
      try {
        pathname = decodeURIComponent(url.pathname)
      } catch {
        return json(res, 400, { error: 'Ruta inválida.' })
      }
      const file = resolve(
        root,
        routes.includes(pathname) ? 'index.html' : `.${pathname}`,
      )
      if (!file.startsWith(root + sep))
        return json(res, 403, { error: 'Ruta no permitida.' })
      try {
        const content = await readFile(file)
        res.writeHead(200, {
          'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
          'Cache-Control': pathname.startsWith('/assets/')
            ? 'public, max-age=31536000, immutable'
            : 'no-cache',
        })
        res.end(req.method === 'HEAD' ? undefined : content)
      } catch (error) {
        if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code))
          return json(res, 404, { error: 'Recurso no encontrado.' })
        throw error
      }
    } catch (error) {
      logger.error('Request failed:', error.message)
      if (!res.headersSent)
        json(res, 500, {
          error: 'No se pudo guardar el proyecto. Intenta de nuevo.',
        })
      else res.end()
    }
  })
}
