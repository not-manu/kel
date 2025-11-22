import { ComposeMessage } from '@renderer/components/compose-message'
import { MessageContent } from '@renderer/components/message-content'
import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'
import { useAiStreaming } from '@renderer/hooks/use-ai'
import { useChat } from '@renderer/hooks/use-chat'
import { useMessages } from '@renderer/hooks/use-message'
import { useSettings } from '@renderer/hooks/use-settings'
import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { BracesIcon, CopyIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const chat = useChat(Number(id))
  const { data: messages } = useMessages(Number(id))
  const { isStreaming } = useAiStreaming(Number(id))
  const { settings } = useSettings()

  useTitlebar({ title: chat.data?.title || 'New Chat' })

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="flex-grow overflow-y-auto px-4 flex flex-col gap-2" tabIndex={-1}>
        <div className="my-0.5"></div>
        {messages?.map((message, index) =>
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
              <MessageContent content={message.content} className="mt-0.25" />
            </div>
          ) : (
            <div key={message.id} className="mb-4 text-sm">
              <MessageContent content={message.content} />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyMessage(message.content)}
                  tabIndex={-1}
                  className={cn(
                    'mt-4 text-f-500  group rounded p-0.5 flex',
                    !isStreaming && index === messages.length - 1 && 'animate-in fade-in'
                  )}
                  aria-label="Copy message"
                >
                  <CopyIcon className="size-3 group-hover:text-f-300" />
                </button>
                <button
                  tabIndex={-1}
                  className={cn(
                    'mt-4 text-f-500  group rounded p-0.5 flex',
                    !isStreaming && index === messages.length - 1 && 'animate-in fade-in delay-100'
                  )}
                  aria-label="View raw JSON"
                >
                  <BracesIcon className="size-3 group-hover:text-f-300" />
                </button>
              </div>
            </div>
          )
        )}
        <div className="my-8"></div>
      </div>
      <ComposeMessage chatId={Number(id)} />
    </div>
  )
}
