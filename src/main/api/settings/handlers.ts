import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { settings } from '../../db/tables/settings'
import { updateSettingsSchema, type Settings, type UpdateSettings } from './schema'

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', async (): Promise<Settings | null> => {
    const result = await db.select().from(settings).limit(1)
    return result[0] || null
  })

  ipcMain.handle(
    'settings:update',
    async (_event, data: UpdateSettings): Promise<Settings | null> => {
      // Validate the input data
      const validated = updateSettingsSchema.parse(data)

      await db
        .update(settings)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(settings.id, 0))

      const result = await db.select().from(settings).limit(1)
      return result[0] || null
    }
  )
}
