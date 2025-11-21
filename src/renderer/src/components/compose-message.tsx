import { InputGroup, InputGroupAddon, InputGroupTextarea } from './ui/input-group'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'

export function ComposeMessage() {
  const handleSend = () => {
    // TODO: Implement send message logic
    console.log('Send message')
  }

  return (
    <div>
      <InputGroup className="group border-t border-x-0 border-b-0 min-h-48 rounded-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-input/15 [[data-slot=input-group-control]:focus-visible]:border-t-f-400
      has-[[data-slot=input-group-control]:focus-visible]:ring-0
      ">
        <InputGroupTextarea placeholder="Type your message..." rows={3} />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-2 w-full">
            <ModelSelector />
            <div className="flex-grow"></div>
            <Button
              onClick={handleSend}
              size="sm"
              className="text-xs h-7 rounded-sm px-5 mr-[-4px] mb-[-4px]"
            >
              Send
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
