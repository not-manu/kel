import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { InferElectron } from '@renderer/lib/types'
import type { StreamEvent } from '@shared/schemas'

type Messages = InferElectron<typeof window.api.message.listByChatId>
export type Message = Messages extends Array<infer T> ? T : never
export type CreateMessageData = Parameters<typeof window.api.message.create>[0]

export const messageKey = ['message'] as const

export function useMessages(chatId: number) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [messageKey, chatId],
    queryFn: async () => await window.api.message.listByChatId(chatId),
    enabled: chatId > 0
  })

  useEffect(() => {
    const unsubscribe = window.api.ai.onStream((event: StreamEvent) => {
      if (event.chatId !== chatId) return

      queryClient.setQueryData([messageKey, chatId], (old: Message[] = []) => {
        const { chunk } = event

        if (chunk.type === 'text-delta') {
          const messages = old as Message[]
          const lastMsg = messages[messages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.id) {
            return [...messages.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk.text }]
          }
          return [
            ...messages,
            {
              role: 'assistant' as const,
              content: chunk.text,
              chatId,
              createdAt: new Date(),
              id: 0
            }
          ]
        }

        if (chunk.type === 'finish') {
          queryClient.invalidateQueries({ queryKey: [messageKey, chatId] })
        }

        return old
      })
    })

    return unsubscribe
  }, [chatId, queryClient])

  return query
}

export function useCreateMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMessageData) => {
      const result = await window.api.message.create(data)
      return result
    },
    onSuccess: (_data, { chatId }) => {
      queryClient.invalidateQueries({ queryKey: [messageKey, chatId] })
    }
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await window.api.message.delete(id)
      return result
    },
    onSuccess: (_data, _id) => {
      queryClient.invalidateQueries({ queryKey: messageKey })
    }
  })
}
