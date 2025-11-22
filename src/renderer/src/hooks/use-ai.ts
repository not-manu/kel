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
        console.log(
          '[useAiStreaming] Received event:',
          event.chunk.type,
          'for chatId:',
          event.chatId,
          'isAborted:',
          isAbortedRef.current
        )

        // Ignore all events if we've aborted
        if (isAbortedRef.current) {
          console.log('[useAiStreaming] Ignoring event because stream was aborted')
          return
        }

        if (event.chunk.type === 'finish' || event.chunk.type === 'error') {
          console.log('[useAiStreaming] Setting isStreaming to false')
          setIsStreaming(false)
          isAbortedRef.current = false // Reset for next stream
        } else if (event.chunk.type === 'text-delta') {
          console.log('[useAiStreaming] Setting isStreaming to true')
          setIsStreaming(true)
        }
      }
    })
    return unsubscribe
  }, [chatId])

  const abort = async () => {
    console.log('[useAiStreaming] abort() called, setting isStreaming to false immediately')
    isAbortedRef.current = true
    setIsStreaming(false)
    await window.api.ai.abort()
    console.log('[useAiStreaming] abort() completed')
  }

  return { isStreaming, abort }
}
