import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'
import { getDatabasePath } from './config'
import * as schema from './schema.js'

const databasePath = getDatabasePath()
const databaseUrl = `file:${databasePath}`

export const db = drizzle(databaseUrl, { schema })

export async function runMigrations() {
  const migrationsPath = app.isPackaged
    ? join(process.resourcesPath, 'drizzle')
    : join(__dirname, '..', '..', 'drizzle')


  // Only run migrations if the folder exists
  if (existsSync(join(migrationsPath, 'meta', '_journal.json'))) {
    await migrate(db, { migrationsFolder: migrationsPath })
  }
}

export type Database = typeof db
