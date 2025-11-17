import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="p-4 bg-transparent text-foreground h-[100vh]">
      <Outlet />
    </div>
  )
}
