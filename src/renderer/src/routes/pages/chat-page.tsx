import { useChat } from '@renderer/hooks/use-chat'
import { useMessages } from '@renderer/hooks/use-message'
import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { useParams } from 'react-router-dom'

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const chat = useChat(Number(id))
  const { data: messages } = useMessages(Number(id))

  useTitlebar({ title: chat.data?.title || 'New Chat' })

  return (
    <div className="flex-grow px-4">
      <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  )
}
