import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'
import { getDatabasePath } from './config'
import * as schema from './schema.js'
import { settings } from './tables/settings'
import { userInfo } from 'os'

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

export async function initializeSettings() {
  // Check if settings table has any rows
  const existingSettings = await db.select().from(settings).limit(1)
  
  if (existingSettings.length === 0) {
    // Get the system username
    const username = userInfo().username
    
    // Create default settings row with the username as preferred name
    await db.insert(settings).values({
      preferredName: username,
      apiKey: null,
      apiKeyType: null,
    })
  }
}

export type Database = typeof db
