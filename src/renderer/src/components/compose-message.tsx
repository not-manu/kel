import { ArrowUpIcon, SquareIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateNewChat, useAiStreaming } from '@renderer/hooks/use-ai'
import { messageKey, type Message } from '@renderer/hooks/use-message'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group'

interface ComposeMessageProps {
  chatId?: number
}

export function ComposeMessage({ chatId }: ComposeMessageProps) {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createNewChat = useCreateNewChat()
  const { isStreaming, abort } = useAiStreaming(chatId)

  const handleSend = async () => {
    if (!prompt.trim()) return

    const userMessage = prompt.trim()

    // Immediately add user message to cache if we have a chatId
    if (chatId) {
      queryClient.setQueryData([messageKey, chatId], (old: Message[] = []) => [
        ...old,
        {
          role: 'user' as const,
          content: userMessage,
          chatId,
          createdAt: new Date(),
          id: 0
        }
      ])
    }

    createNewChat.mutate(
      { prompt: userMessage, chatId },
      {
        onSuccess: (result) => {
          setPrompt('')
          if (!chatId) navigate(`/chat/${result.chatId}`)
        },
        onError: (error) => {
          console.error('Failed to create chat:', error)
        }
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <InputGroup
        className="group border-t border-x-0 min-h-48 border-b-0 rounded-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-input/15 
      has-[[data-slot=input-group-control]:focus-visible]:ring-0
      "
      >
        <InputGroupTextarea
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          autoFocus
        />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-2 w-full">
            <ModelSelector />
            <div className="flex-grow"></div>
            <Button
              onClick={isStreaming ? abort : handleSend}
              size="sm"
              variant={isStreaming ? 'secondary' : 'default'}
              className={
                isStreaming
                  ? 'text-xs aspect-square w-7 h-7 mr-[-4px] mb-[-4px] bg-f-600 hover:bg-f-500 text-white'
                  : 'text-xs aspect-square w-7 h-7 mr-[-4px] mb-[-4px] bg-[#c15f3c] hover:bg-[#d0704d] text-white'
              }
              disabled={isStreaming ? false : !prompt.trim() || createNewChat.isPending}
            >
              {isStreaming ? <SquareIcon className="size-3" /> : <ArrowUpIcon />}
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
