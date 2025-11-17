import { Titlebar } from '@renderer/components/Titlebar'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: Infinity
          },
          mutations: {
            retry: 1
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background/75 text-foreground h-[100vh] border-l dark:border-f-800/75 border-f-200/75 flex flex-col">
        <Titlebar />
        <Outlet />
      </div>
    </QueryClientProvider>
  )
}
