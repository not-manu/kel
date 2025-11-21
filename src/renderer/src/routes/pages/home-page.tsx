import { Greeting } from '@renderer/components/greeting'
import { useChats } from '@renderer/hooks/use-chat'
import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { Link } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'

export function HomePage() {
  useTitlebar({ title: 'Kel' })
  const { chats } = useChats()

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="h-8"></div>
      <div className="px-4">
        <Greeting />
      </div>
      <div className="h-8"></div>
      <div className="p-4 text-xs text-f-300">Recents</div>
      <pre className="text-sm p-4">{JSON.stringify(chats, null, 2)}</pre>
      <div className="p-4">
        <Link to="/chat/new">
          <Button className="w-full">Start New Chat</Button>
        </Link>
      </div>
      <div className='flex-grow'></div>
      <textarea
        className="resize-none p-4 bg-transparent border-t border-f-800/75 outline-none h-64 text-sm"
        placeholder="Type a message..."
      />
      <div className='h-7 border-t border-f-800/75'></div>
    </div>
  )
}
