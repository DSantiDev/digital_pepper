import routes from '../shared/routes.json' with { type: 'json' }
export { routes }
export function normalizeSiteUrl(value) {
  const url = new URL(value)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'SITE_URL debe ser un origen http(s), por ejemplo https://tu-dominio.com',
    )
  return url.origin
}
const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
export function sitemap(siteUrl) {
  const origin = normalizeSiteUrl(siteUrl)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${escapeXml(origin + route)}</loc></url>`).join('\n')}\n</urlset>\n`
}
export function robots(siteUrl) {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${normalizeSiteUrl(siteUrl)}/sitemap.xml\n`
}
