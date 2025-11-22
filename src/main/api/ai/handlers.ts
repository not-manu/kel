import { ipcMain, type BrowserWindow } from 'electron'
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
import { streamText } from 'ai'

let mainWindow: BrowserWindow | null = null

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

async function processAiStream(chatId: number, prompt: string) {
  const { openrouter, selectedModel } = await createOpenRouter()
  const result = streamText({
    model: openrouter(selectedModel),
    prompt
  })

  let fullResponse = ''
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
}

export function registerAiHandlers() {
  ipcMain.handle('chat:new', async (_event, data: CreateChatNewData): Promise<ChatNewResponse> => {
    const validated = createChatNewSchema.parse(data)
    const chatId = await createNewChat(validated.prompt)

    processAiStream(chatId, validated.prompt).catch((error) => {
      console.error('AI stream processing error:', error)
    })

    return { chatId }
  })
}
