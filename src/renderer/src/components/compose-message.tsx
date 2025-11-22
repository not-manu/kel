import { ArrowUpIcon } from 'lucide-react'
import { useState } from 'react'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group'

export function ComposeMessage() {
  const [prompt, setPrompt] = useState('')
  const handleSend = () => {
    // TODO: Implement send message logic
    alert(prompt)
  }

  return (
    <div>
      <InputGroup
        className="group border-t border-x-0 border-b-0 min-h-48 rounded-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-input/15 [[data-slot=input-group-control]:focus-visible]:border-t-f-500
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
              className="text-xs aspect-square w-7 h-7 mr-[-4px] mb-[-4px]"
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
