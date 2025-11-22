import { createContext, useContext, useEffect } from 'react'

interface TitlebarContextType {
  title: string
  setTitle: (title: string) => void
}

export const TitlebarContext = createContext<TitlebarContextType | undefined>(undefined)

export function useTitlebar(options?: { title?: string }) {
  const context = useContext(TitlebarContext)

  if (!context) {
    throw new Error('useTitlebar must be used within a TitlebarProvider')
  }

  useEffect(() => {
    if (options?.title) {
      context.setTitle(options.title)
    }
  }, [options?.title, context])

  return context
}
