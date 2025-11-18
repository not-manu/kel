import { Greeting } from '@renderer/components/greeting'
import { useTitlebar } from '@renderer/hooks/use-titlebar'

export function HomePage() {
  useTitlebar({ title: 'Kel' })

  return (
    <div className="p-4">
      <Greeting />
    </div>
  )
}
