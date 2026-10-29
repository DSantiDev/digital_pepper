import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { services } from './validation.js'
const root = fileURLToPath(new URL('../', import.meta.url))
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(resolve(dir, entry.name))
      : [resolve(dir, entry.name)],
  )
}
test('estilos y compilación sin declaraciones de prioridad', () => {
  const styles = files(resolve(root, 'src')).filter((file) =>
    file.endsWith('.css'),
  )
  if (existsSync(resolve(root, 'dist/assets')))
    styles.push(
      ...files(resolve(root, 'dist/assets')).filter((file) =>
        file.endsWith('.css'),
      ),
    )
  for (const file of styles)
    assert.doesNotMatch(readFileSync(file, 'utf8'), /!\s*important/i, file)
})
test('recursos originales locales y catálogo compartido', () => {
  assert.equal(services.length, 6)
  const images = files(resolve(root, 'public/images'))
  assert.equal(images.length, 5)
  for (const file of images) assert.ok(statSync(file).size > 1000)
  for (const file of files(resolve(root, 'src')).filter((file) =>
    /\.(css|tsx)$/.test(file),
  ))
    assert.doesNotMatch(
      readFileSync(file, 'utf8'),
      /https:\/\/(images\.unsplash|fonts\.googleapis)/,
    )
})
