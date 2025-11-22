import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKey } from './use-chat'

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
