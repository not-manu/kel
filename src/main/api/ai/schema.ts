import { z } from 'zod'

// Message schemas matching AI SDK format
const userMessageSchema = z.object({
  role: z.literal('user'),
  content: z.string()
})

const assistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: z.string()
})

const systemMessageSchema = z.object({
  role: z.literal('system'),
  content: z.string()
})

const messageSchema = z.union([
  userMessageSchema,
  assistantMessageSchema,
  systemMessageSchema
])

// Chat request schema compatible with AI SDK
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  model: z.string().optional(),
  data: z.record(z.string(), z.any()).optional()
})

// TypeScript types
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type AiMessage = z.infer<typeof messageSchema>

// Client-side API interface
export interface AiApi {
  chat: (
    request: ChatRequest,
    onData: (chunk: { type: string; value: string }) => void,
    onFinish: (result: { text: string; usage?: any; finishReason?: string }) => void,
    onError: (error: Error) => void
  ) => Promise<{ streamId: string; cancel: () => void }>
}