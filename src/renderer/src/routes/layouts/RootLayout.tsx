import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="p-4 bg-background/75 text-foreground h-[100vh] border-l dark:border-f-800/75 border-f-200/75">
      <Outlet />
    </div>
  )
}
