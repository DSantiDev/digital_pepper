import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
export function createStore(filename) {
  if (filename !== ':memory:')
    mkdirSync(dirname(filename), { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(filename)
  db.exec(
    'PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, service TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL)',
  )
  const insert = db.prepare('INSERT INTO contacts VALUES (?, ?, ?, ?, ?, ?)')
  return {
    save(data) {
      const id = randomUUID()
      insert.run(
        id,
        data.name,
        data.email,
        data.service,
        data.message,
        new Date().toISOString(),
      )
      return id
    },
    close() {
      db.close()
    },
  }
}
