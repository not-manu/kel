import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKey } from './use-chat'
import { useState, useEffect } from 'react'

export type CreateChatNewData = Parameters<typeof window.api.ai.new>[0]
export type ChatNewResponse = Awaited<ReturnType<typeof window.api.ai.new>>

export function useCreateNewChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateChatNewData) => {
      const result = await window.api.ai.new(data)
      return result
    },
    onSuccess: () => {
      // Invalidate the chat list cache to refetch the updated list
      queryClient.invalidateQueries({ queryKey: chatKey })
    }
  })
}

export function useAiStreaming(chatId?: number) {
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    const unsubscribe = window.api.ai.onStream((event) => {
      if (chatId && event.chatId === chatId) {
        setIsStreaming(event.chunk.type !== 'finish')
      }
    })
    return unsubscribe
  }, [chatId])

  const abort = async () => {
    await window.api.ai.abort()
    setIsStreaming(false)
  }

  return { isStreaming, abort }
}
