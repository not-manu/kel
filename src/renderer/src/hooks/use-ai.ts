import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKey } from './use-chat'
import { useState, useEffect, useRef } from 'react'

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
  const isAbortedRef = useRef(false)

  useEffect(() => {
    // Reset aborted flag when chatId changes (new chat started)
    isAbortedRef.current = false

    const unsubscribe = window.api.ai.onStream((event) => {
      if (!chatId || event.chatId === chatId) {
        // Ignore all events if we've aborted
        if (isAbortedRef.current) {
          return
        }

        if (event.chunk.type === 'finish' || event.chunk.type === 'error') {
          setIsStreaming(false)
          isAbortedRef.current = false // Reset for next stream
        } else if (event.chunk.type === 'text-delta') {
          setIsStreaming(true)
        }
      }
    })
    return unsubscribe
  }, [chatId])

  const abort = async () => {
    isAbortedRef.current = true
    setIsStreaming(false)
    await window.api.ai.abort()
  }

  return { isStreaming, abort }
}
