import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="p-4 bg-background text-foreground h-[100vh] border-l border-f-900">
      <Outlet />
    </div>
  )
}
