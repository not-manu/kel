import { useChatAI } from '@renderer/hooks/use-chat-ai'
import { useEffect, useRef } from 'react'
import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { ArrowUpIcon, StopCircle } from 'lucide-react'

export function ChatPage() {
  // const { id: chatId } = useParams<{ id: string }>() // TODO: Use for DB integration
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChatAI({
    initialMessages: [
      {
        id: 'system-1',
        role: 'system',
        content: "You are Kel, a helpful AI assistant that lives on the user's computer."
      }
    ],
    onFinish: (message) => {
      console.log('AI response complete:', message)
      // TODO: Save to database
    },
    onError: (err) => {
      console.error('Chat error:', err)
    }
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages
          .filter((m) => m.role !== 'system')
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="text-xs font-medium mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'Kel'}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Kel..."
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] pr-12 resize-none"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            {isLoading ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={stop}
                className="h-8 w-8 p-0 rounded-full"
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim()}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
