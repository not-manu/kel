import { ipcMain, type BrowserWindow } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { chat } from '../../db/tables/chat'
import { message } from '../../db/tables/message'
import {
  createChatNewSchema,
  type CreateChatNewData,
  type ChatNewResponse,
  type StreamEvent
} from './schema'
import { createOpenRouter } from '../../lib/openrouter'
import { streamText, smoothStream } from 'ai'

let mainWindow: BrowserWindow | null = null
let currentAbortController: AbortController | null = null

export function setMainWindow(window: BrowserWindow) {
  mainWindow = window
}

export function sendStreamEvent(event: StreamEvent) {
  mainWindow?.webContents.send('chat:stream', event)
}

async function createNewChat(prompt: string) {
  const title = prompt.length > 150 ? prompt.substring(0, 150) + '...' : prompt

  const chatResult = await db
    .insert(chat)
    .values({
      title
    })
    .returning()

  const newChat = chatResult[0]

  await db.insert(message).values({
    chatId: newChat.id,
    role: 'user',
    content: prompt
  })

  return newChat.id
}

async function processAiStream(chatId: number) {
  const { openrouter, selectedModel } = await createOpenRouter()

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt)

  // Create a new AbortController for this stream
  currentAbortController = new AbortController()

  const result = streamText({
    model: openrouter(selectedModel),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    experimental_transform: smoothStream({
      delayInMs: 50
    }),
    abortSignal: currentAbortController.signal
  })

  let fullResponse = ''
  try {
    for await (const chunk of result.fullStream) {
      if (chunk.type === 'text-delta') {
        fullResponse += chunk.text
        sendStreamEvent({ chatId, chunk })
      } else if (chunk.type === 'finish') {
        sendStreamEvent({ chatId, chunk })
      }
    }

    await db.insert(message).values({
      chatId,
      role: 'assistant',
      content: fullResponse
    })
  } catch (error: unknown) {
    // If aborted, save partial response
    if (error instanceof Error && error.name === 'AbortError') {
      if (fullResponse.trim()) {
        await db.insert(message).values({
          chatId,
          role: 'assistant',
          content: fullResponse
        })
      }
      // Send finish event after abort
      sendStreamEvent({
        chatId,
        chunk: {
          type: 'finish',
          finishReason: 'stop',
          totalUsage: {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0
          }
        }
      })
    } else {
      throw error
    }
  } finally {
    currentAbortController = null
  }
}

export function registerAiHandlers() {
  ipcMain.handle('chat:new', async (_event, data: CreateChatNewData): Promise<ChatNewResponse> => {
    const validated = createChatNewSchema.parse(data)

    let chatId: number
    if (validated.chatId) {
      chatId = validated.chatId
      await db.insert(message).values({
        chatId,
        role: 'user',
        content: validated.prompt
      })
    } else {
      chatId = await createNewChat(validated.prompt)
    }

    processAiStream(chatId).catch((error) => {
      console.error('AI stream processing error:', error)
    })

    return { chatId }
  })

  ipcMain.handle('chat:abort', async () => {
    if (currentAbortController) {
      currentAbortController.abort()
      currentAbortController = null
    }
  })
}
