import { ipcMain } from 'electron'
import { db } from '../../db'
import { chat } from '../../db/tables/chat'
import { message } from '../../db/tables/message'
import { createChatNewSchema, type CreateChatNewData, type ChatNewResponse } from './schema'

export function registerAiHandlers() {
  ipcMain.handle('chat:new', async (_event, data: CreateChatNewData): Promise<ChatNewResponse> => {
    const validated = createChatNewSchema.parse(data)

    // Create a new chat with a default title (can be updated later)
    const chatResult = await db
      .insert(chat)
      .values({
        title: 'New Chat'
      })
      .returning()

    const newChat = chatResult[0]

    // Create the initial user message
    await db.insert(message).values({
      chatId: newChat.id,
      role: 'user',
      content: validated.prompt
    })

    return {
      chatId: newChat.id
    }
  })
}
