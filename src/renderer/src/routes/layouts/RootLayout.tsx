import { Titlebar } from '@renderer/components/Titlebar'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="bg-background/75 text-foreground h-[100vh] border-l dark:border-f-800/75 border-f-200/75 flex flex-col">
      <Titlebar />
      <Outlet />
    </div>
  )
}
