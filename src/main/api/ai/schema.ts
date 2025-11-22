import { z } from 'zod'

export const SupportedModels = [
  'anthropic/claude-sonnet-4.5',
  'anthropic/claude-haiku-4.5'
] as const
export type SupportedModel = (typeof SupportedModels)[number]

// Zod schemas for validation
export const createChatNewSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required')
})

// TypeScript types
export type CreateChatNewData = z.infer<typeof createChatNewSchema>

export type ChatNewResponse = {
  chatId: number
}

// Client-side API interface
export interface AiApi {
  new: (data: CreateChatNewData) => Promise<ChatNewResponse>
}
