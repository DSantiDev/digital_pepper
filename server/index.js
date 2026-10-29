import { fileURLToPath } from 'node:url'
import { createStore } from './store.js'
import { createApp } from './app.js'
const store = createStore(
  process.env.DATABASE_PATH ??
    fileURLToPath(new URL('../data/contacts.sqlite', import.meta.url)),
)
const app = createApp({
  store,
  siteUrl: process.env.SITE_URL,
  publicDir: fileURLToPath(new URL('../dist', import.meta.url)),
})
const port = Number(process.env.PORT ?? 3001)
app.listen(port, process.env.HOST ?? '127.0.0.1', () =>
  console.log(`Digital Pepper: http://localhost:${port}`),
)
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    app.close(() => {
      store.close()
      process.exit(0)
    }),
  )
