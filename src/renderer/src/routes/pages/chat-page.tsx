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
      <div className="flex-grow overflow-y-auto px-4 flex flex-col gap-2" tabIndex={-1}>
        <div className="my-0.5"></div>
        {messages?.map((message) =>
          message.role === 'user' ? (
            <div
              key={message.id}
              className="mb-4 flex text-sm gap-2 bg-f-900 py-2 pl-2 pr-3 rounded-lg w-fit"
            >
              <Avatar className="w-6 h-6 text-xs font-semibold">
                <AvatarFallback className="bg-f-paper text-background">
                  {settings?.preferredName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="mt-0.25">
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ) : (
            <div key={message.id} className="mb-4 whitespace-pre-wrap text-sm">
              <Markdown>{message.content}</Markdown>
            </div>
          )
        )}
      </div>
      <ComposeMessage chatId={Number(id)} />
    </div>
  )
}
