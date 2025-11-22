import { ArrowUpIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateNewChat } from '@renderer/hooks/use-ai'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group'

interface ComposeMessageProps {
  chatId?: number
}

export function ComposeMessage({ chatId }: ComposeMessageProps) {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const createNewChat = useCreateNewChat()

  const handleSend = async () => {
    if (!prompt.trim()) return

    createNewChat.mutate(
      { prompt: prompt.trim(), chatId },
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
    // Check for Command+Enter (Mac) or Ctrl+Enter (Windows/Linux)
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
              onClick={handleSend}
              size="sm"
              className="text-xs aspect-square w-7 h-7 mr-[-4px] mb-[-4px] bg-[#c15f3c] hover:bg-[#d0704d] text-white"
              disabled={!prompt.trim() || createNewChat.isPending}
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
