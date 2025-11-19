import { z } from 'zod'

// API key type enum
export const apiKeyTypeEnum = ['Openrouter', 'Anthropic'] as const

// Zod schema for settings validation
export const settingsSchema = z.object({
  id: z.number().default(0),
  preferredName: z.string().min(1, 'Preferred name is required').max(100),
  apiKey: z.string().min(1).max(500).nullable(),
  apiKeyType: z.enum(apiKeyTypeEnum).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
})

// Schema for updating settings (partial, excluding id and timestamps)
export const updateSettingsSchema = z.object({
  preferredName: z.string().min(1, 'Preferred name is required').max(100).optional(),
  apiKey: z.string().min(1).max(500).nullable().optional(),
  apiKeyType: z.enum(apiKeyTypeEnum).nullable().optional()
})

// Infer TypeScript types from schemas
export type Settings = z.infer<typeof settingsSchema>
export type UpdateSettings = z.infer<typeof updateSettingsSchema>
