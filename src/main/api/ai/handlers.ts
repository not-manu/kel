import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { db } from '../../db'
import { settings } from '../../db/tables/settings'
import { chatRequestSchema, type ChatRequest } from './schema'

// Store for active stream abort controllers
const activeStreams = new Map<string, AbortController>()

export function registerAiHandlers() {
  // Main chat handler compatible with AI SDK useChat hook
  ipcMain.handle('ai:chat', async (event: IpcMainInvokeEvent, data: ChatRequest) => {
    const validated = chatRequestSchema.parse(data)

    // Get API settings
    const settingsData = await db.select().from(settings).limit(1)
    if (!settingsData[0]?.apiKey || !settingsData[0]?.apiKeyType) {
      throw new Error('API key not configured. Please set up your API key in settings.')
    }

    const { apiKey, apiKeyType } = settingsData[0]

    // Generate unique stream ID
    const streamId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create abort controller for this stream
    const abortController = new AbortController()
    activeStreams.set(streamId, abortController)

    try {
      // Initialize the provider
      let provider
      if (apiKeyType === 'openrouter') {
        provider = createOpenRouter({
          apiKey
        })
      } else {
        throw new Error(`Unsupported API provider: ${apiKeyType}`)
      }

      const model = validated.model || 'anthropic/claude-3.5-sonnet'

      // Start streaming
      const result = await streamText({
        model: provider(model),
        messages: validated.messages,
        abortSignal: abortController.signal
      })

      // Stream data in AI SDK compatible format
      for await (const textPart of result.textStream) {
        if (abortController.signal.aborted) {
          break
        }
        // Send text chunks
        event.sender.send(`ai:data:${streamId}`, {
          type: 'text',
          value: textPart
        })
      }

      // Get the full response and usage
      const fullText = await result.text
      const usage = await result.usage

      // Send finish event with metadata
      event.sender.send(`ai:finish:${streamId}`, {
        text: fullText,
        usage,
        finishReason: result.finishReason
      })

      return { streamId }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      event.sender.send(`ai:error:${streamId}`, errorMessage)
      throw error
    } finally {
      activeStreams.delete(streamId)
    }
  })

  // Cancel stream handler
  ipcMain.handle('ai:cancel', async (_event, streamId: string) => {
    const controller = activeStreams.get(streamId)
    if (controller) {
      controller.abort()
      activeStreams.delete(streamId)
      return true
    }
    return false
  })
}