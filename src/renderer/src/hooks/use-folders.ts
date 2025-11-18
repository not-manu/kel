import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InferElectron } from '@renderer/lib/types'

export type Folder = InferElectron<typeof window.api.folders.list>
export type CreateFolderData = Parameters<typeof window.api.folders.create>[0]
export type UpdateFolderData = Parameters<typeof window.api.folders.update>[1]

export const foldersKey = ['folders'] as const

export function useFolders() {
  const { data: folders, ...rest } = useQuery({
    queryKey: foldersKey,
    queryFn: async () => await window.api.folders.list()
  })

  return { folders, ...rest }
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFolderData) => {
      const result = await window.api.folders.create(data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKey })
    }
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateFolderData }) => {
      const result = await window.api.folders.update(id, data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKey })
    }
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await window.api.folders.delete(id)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKey })
    }
  })
}

export function useGetFolderByPath() {
  return (path: string) =>
    useQuery({
      queryKey: ['folders', 'byPath', path],
      queryFn: async () => await window.api.folders.getByPath(path)
    })
}
