import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { db } from '../db'
import { settings } from '../db/tables/settings'

export type Settings = InferSelectModel<typeof settings>

export interface UpdateData {
  preferredName?: string
  apiKey?: string | null
  apiKeyType?: 'Openrouter' | 'Anthropic' | null
}

export interface SettingsApi {
  get: () => Promise<Settings | null>
  update: (data: UpdateData) => Promise<Settings | null>
}

export function createSettingsApi(ipcRenderer: any): SettingsApi {
  return {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (data) => ipcRenderer.invoke('settings:update', data)
  }
}

export function registerSettingsApi() {
  ipcMain.handle('settings:get', async (): Promise<Settings | null> => {
    const result = await db.select().from(settings).limit(1)
    return result[0] || null
  })

  ipcMain.handle('settings:update', async (_event, data: UpdateData): Promise<Settings | null> => {
    await db
      .update(settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(settings.id, 0))

    const result = await db.select().from(settings).limit(1)
    return result[0] || null
  })
}
