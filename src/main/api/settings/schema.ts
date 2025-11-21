import type { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'
import { SupportedModels } from '../../api/ai/schema'
import type { settings } from '../../db/tables/settings'
import { apiKeyTypeEnum } from '../../db/tables/settings'

// Inferred type from database schema
export type Settings = InferSelectModel<typeof settings>

// Zod schemas for validation
export const settingsSchema = z.object({
  id: z.number().default(0),
  preferredName: z.string().min(1, 'Preferred name is required').max(100),
  apiKey: z.string().min(1).max(500).nullable(),
  apiKeyType: z.enum(apiKeyTypeEnum).nullable(),
  selectedModel: z.enum(SupportedModels).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
})

export const updateSettingsSchema = z.object({
  preferredName: z.string().min(1, 'Preferred name is required').max(100).optional(),
  apiKey: z.string().min(1).max(500).nullable().optional(),
  apiKeyType: z.enum(apiKeyTypeEnum).nullable().optional(),
  selectedModel: z.enum(SupportedModels).optional(),
})

// TypeScript types
export type UpdateSettings = z.infer<typeof updateSettingsSchema>

// Client-side API interface
export interface SettingsApi {
  get: () => Promise<Settings | null>
  update: (data: UpdateSettings) => Promise<Settings | null>
}
