import { ipcMain, ipcRenderer } from 'electron'
import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { db } from '../db'
import { settings } from '../db/tables/settings'

export namespace SettingsApi {
  // Infer types from Drizzle schema
  export type Settings = InferSelectModel<typeof settings>

  export interface UpdateData {
    preferredName?: string
    apiKey?: string | null
    apiKeyType?: 'Openrouter' | 'Anthropic' | null
  }

  // Client methods for renderer (IPC calls)
  export const client = {
    get: (): Promise<Settings | null> => ipcRenderer.invoke('settings:get'),
    update: (data: UpdateData): Promise<Settings | null> =>
      ipcRenderer.invoke('settings:update', data)
  }
}

export function registerSettingsApi() {
  console.log('Registering settings API handlers')
  // Get settings
  ipcMain.handle('settings:get', async (): Promise<SettingsApi.Settings | null> => {
    console.log('Fetching settings from database')
    const result = await db.select().from(settings).limit(1)
    console.log('Settings result:', result[0])
    return result[0] || null
  })

  // Update settings
  ipcMain.handle(
    'settings:update',
    async (_event, data: SettingsApi.UpdateData): Promise<SettingsApi.Settings | null> => {
      // Since we only have one row with id = 0, we can update it directly
      await db
        .update(settings)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(settings.id, 0))

      // Return the updated settings
      const result = await db.select().from(settings).limit(1)
      return result[0] || null
    }
  )
}
