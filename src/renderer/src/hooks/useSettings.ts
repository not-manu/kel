import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InferElectron } from '@renderer/lib/types'

export type Settings = InferElectron<typeof window.api.settings.get>
export type UpdateData = Parameters<typeof window.api.settings.update>[0]

export const settingsKey = ['settings'] as const

export function useSettings() {
  const { data: settings, ...rest } = useQuery({
    queryKey: settingsKey,
    queryFn: async () => await window.api.settings.get()
  })

  return { settings, ...rest }
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateData) => {
      const result = await window.api.settings.update(data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKey })
    }
  })
}
