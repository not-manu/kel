import { useChats } from '@renderer/hooks/use-chat'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function RecentChats() {
  const { chats, isLoading } = useChats()

  if (isLoading) {
    return <div className="p-4 text-f-500">Loading chats...</div>
  }

  if (!chats || chats.length === 0) {
    return <div className="p-4 text-f-500 text-xs">No chats yet...</div>
  }

  // Only show the most recent 10 chats
  const recentChats = chats.slice(0, 10)

  return (
    <div className="px-4 text-xs flex flex-col">
      {recentChats.map((chat) => (
        <Link
          to={`/chat/${chat.id}`}
          key={chat.id}
          className="py-1.5 text-f-300 hover:text-foreground flex items-center justify-between gap-4"
          tabIndex={-1}
        >
          <div className="whitespace-nowrap truncate flex-1">{chat.title || 'Untitled Chat'}</div>
          <div className="text-f-700 text-[10px] shrink-0">{dayjs(chat.updatedAt).fromNow()}</div>
        </Link>
      ))}
    </div>
  )
}
