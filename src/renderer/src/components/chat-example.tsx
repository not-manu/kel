import { useChatAI } from '@renderer/hooks/use-chat-ai'

/**
 * Example chat component demonstrating AI SDK usage
 * This can be used as a reference or starting point for building your chat UI
 */
export function ChatExample() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } =
    useChatAI({
      initialMessages: [
        {
          id: 'system-1',
          role: 'system',
          content: 'You are Kel, a helpful AI assistant that lives on the user\'s computer.'
        }
      ],
      onFinish: (message) => {
        console.log('AI response complete:', message)
      },
      onError: (err) => {
        console.error('Chat error:', err)
      }
    })

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((m) => m.role !== 'system') // Don't show system messages
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm font-medium mb-1">{message.role}</div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>

      {/* Controls */}
      {(isLoading || messages.length > 1) && (
        <div className="px-4 py-2 border-t flex gap-2">
          {isLoading && (
            <button
              onClick={stop}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop
            </button>
          )}
          {!isLoading && messages.length > 1 && (
            <button
              onClick={reload}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Regenerate
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
