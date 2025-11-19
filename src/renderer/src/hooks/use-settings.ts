import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InferElectron } from '@renderer/lib/types'
import { useState } from 'react'

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

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSaveSettings() {
  const queryClient = useQueryClient()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  const mutation = useMutation({
    mutationFn: async (data: UpdateData) => {
      setSaveStatus('saving')
      const result = await window.api.settings.update(data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKey })
      setSaveStatus('saved')
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    },
    onError: () => {
      setSaveStatus('error')
      // Reset to idle after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  })

  return { ...mutation, saveStatus }
}
