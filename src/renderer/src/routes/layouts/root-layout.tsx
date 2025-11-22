import { Titlebar } from '@renderer/components/titlebar'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { TitlebarContext } from '@renderer/hooks/use-titlebar'
import { Disclaimer } from '@renderer/components/disclaimer'

export function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
          mutations: {
            retry: 1
          }
        }
      })
  )

  const [title, setTitle] = useState('Kel')

  return (
    <QueryClientProvider client={queryClient}>
      <TitlebarContext.Provider value={{ title, setTitle }}>
        <div className="bg-background/75 text-foreground h-[100vh] border dark:border-f-800/75 border-f-200/75 flex flex-col overflow-x-hidden">
          <Titlebar />
          <Outlet />
          <Disclaimer />
        </div>
      </TitlebarContext.Provider>
    </QueryClientProvider>
  )
}
