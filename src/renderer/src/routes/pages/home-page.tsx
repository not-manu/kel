import { Greeting } from '@renderer/components/greeting'
import { useTitlebar } from '@renderer/hooks/use-titlebar'

export function HomePage() {
  useTitlebar({ title: 'Kel' })

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="h-8"></div>
      <div className="px-4">
        <Greeting />
      </div>
    </div>
  )
}
