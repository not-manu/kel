import { ArrowUpIcon } from 'lucide-react'
import { useState } from 'react'
import { useCreateNewChat } from '@renderer/hooks/use-ai'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group'

export function ComposeMessage() {
  const [prompt, setPrompt] = useState('')
  const createNewChat = useCreateNewChat()

  const handleSend = async () => {
    if (!prompt.trim()) return

    createNewChat.mutate(
      { prompt: prompt.trim() },
      {
        onSuccess: (result) => {
          console.log('Chat created with ID:', result.chatId)
          // Clear the input after successful send
          setPrompt('')
          // TODO: Navigate to the chat or update UI as needed
        },
        onError: (error) => {
          console.error('Failed to create chat:', error)
          // TODO: Show error notification to user
        }
      }
    )
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
