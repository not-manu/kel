import { useChat } from '@renderer/hooks/use-chat'
import { useMessages } from '@renderer/hooks/use-message'
import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { useParams } from 'react-router-dom'
import { ComposeMessage } from '@renderer/components/compose-message'
import { useSettings } from '@renderer/hooks/use-settings'
import Markdown from 'react-markdown'
import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const chat = useChat(Number(id))
  const { data: messages } = useMessages(Number(id))
  const { settings } = useSettings()

  useTitlebar({ title: chat.data?.title || 'New Chat' })

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="h-8"></div>
      <div className="flex-grow overflow-y-auto px-4" tabIndex={-1}>
        {/* <pre className="text-sm whitespace-pre-wrap break-words">
          {JSON.stringify(messages, null, 2)}
        </pre> */}
        {messages?.map((message) =>
          message.role === 'user' ? (
            <div key={message.id} className="mb-4 flex items-start text-sm gap-3 bg-f-900 py-2 px-2 rounded-lg">
              <Avatar>
                <AvatarFallback className='bg-f-paper text-background'>{settings?.preferredName[0]}</AvatarFallback>
              </Avatar>
              <div className=''>
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ) : (
            <div key={message.id} className="mb-4 whitespace-pre-wrap">
              <div className="text-sm font-medium text-f-700 mb-1">Bot:</div>
              <Markdown>{message.content}</Markdown>
            </div>
          )
        )}
      </div>
      <ComposeMessage chatId={Number(id)} />
    </div>
  )
}
