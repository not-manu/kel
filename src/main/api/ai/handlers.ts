import { ipcMain } from 'electron'
import { db } from '../../db'
import { chat } from '../../db/tables/chat'
import { message } from '../../db/tables/message'
import { createChatNewSchema, type CreateChatNewData, type ChatNewResponse } from './schema'

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

export function registerAiHandlers() {
  ipcMain.handle('chat:new', async (_event, data: CreateChatNewData): Promise<ChatNewResponse> => {
    const validated = createChatNewSchema.parse(data)
    const chatId = await createNewChat(validated.prompt)

    

    return {
      chatId
    }
  })
}
