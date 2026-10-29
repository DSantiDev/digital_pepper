import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createStore } from './store.js'
test('persiste contactos después de cerrar y evita interpretar SQL del usuario', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pepper-'))
  const file = join(dir, 'contacts.sqlite')
  try {
    const store = createStore(file)
    const data = {
      name: "Ana'); DROP TABLE contacts; --",
      email: 'ana@example.com',
      service: 'Branding',
      message: 'Proyecto de identidad',
    }
    const id = store.save(data)
    store.close()
    const db = new DatabaseSync(file)
    try {
      const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id)
      assert.equal(row.name, data.name)
      assert.equal(row.message, data.message)
    } finally {
      db.close()
    }
  } finally {
    rmSync(dir, { recursive: true })
  }
})
