import { Link } from 'react-router-dom'
import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { Input } from '@renderer/components/ui/input'

export function SettingsPage() {
  useTitlebar({ title: 'Kel — Settings' })
  return (
    <>
      <Input placeholder="Type here..." type="password" />
      <Link to="/">Go home</Link>
    </>
  )
}
