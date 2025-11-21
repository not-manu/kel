# AI SDK Usage Guide

## Overview

Kel now uses Vercel's AI SDK with a custom `useChatAI` hook that provides a familiar interface for chat interactions with streaming support. The implementation is designed to work seamlessly with Electron's IPC architecture.

## Features

✅ **AI SDK Compatible** - Familiar API inspired by Vercel AI SDK's `useChat`
✅ **Real-time Streaming** - Messages stream in real-time as the AI responds
✅ **Built-in State Management** - Handles loading, errors, and message history
✅ **Type-Safe** - Full TypeScript support throughout the stack
✅ **OpenRouter Integration** - Support for multiple AI models via OpenRouter

## Architecture

### Backend (Main Process)

**Handler**: [src/main/api/ai/handlers.ts](src/main/api/ai/handlers.ts)
- Streams responses using Vercel AI SDK's `streamText`
- Integrates with OpenRouter for multi-model support
- Handles cancellation via abort controllers

**Schema**: [src/main/api/ai/schema.ts](src/main/api/ai/schema.ts)
- Validates incoming requests with Zod
- Type definitions for messages and requests

### Preload Bridge

**API**: [src/main/preload.ts](src/main/preload.ts#L31-L64)
- Exposes `window.api.ai.chat()` to renderer
- Manages IPC event listeners for streaming
- Returns cancel function for aborting streams

### Frontend (Renderer)

**Hook**: [src/renderer/src/hooks/use-chat-ai.ts](src/renderer/src/hooks/use-chat-ai.ts)
- Custom hook mimicking AI SDK's `useChat` API
- Manages message state, input, loading, and errors
- Provides `append`, `reload`, `stop`, and `handleSubmit` methods

## Usage

### Basic Chat Component

```tsx
import { useChatAI } from '@renderer/hooks/use-chat-ai'

function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChatAI()

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={message.role}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
        {isLoading && <div>AI is typing...</div>}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
          className="w-full"
        />
      </form>
    </div>
  )
}
```

### With Initial Messages

```tsx
const { messages, input, handleInputChange, handleSubmit } = useChatAI({
  initialMessages: [
    {
      id: '1',
      role: 'system',
      content: 'You are a helpful assistant for the Kel app.'
    }
  ]
})
```

### With Callbacks

```tsx
const { messages, append } = useChatAI({
  onFinish: (message) => {
    console.log('AI finished:', message)
    // Save to database, show notification, etc.
  },
  onError: (error) => {
    console.error('Error:', error)
    // Show error toast, retry, etc.
  }
})
```

### Programmatic Message Sending

```tsx
function ChatComponent() {
  const { messages, append, isLoading } = useChatAI()

  const askQuestion = async (question: string) => {
    await append({
      role: 'user',
      content: question
    })
  }

  return (
    <div>
      <button
        onClick={() => askQuestion('What is Kel?')}
        disabled={isLoading}
      >
        Ask about Kel
      </button>
      {/* Render messages */}
    </div>
  )
}
```

### Advanced: Stop and Reload

```tsx
function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload } = useChatAI()

  return (
    <div>
      {/* Messages */}
      <div>
        {messages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>

      {/* Controls */}
      {isLoading && (
        <button onClick={stop}>Stop generating</button>
      )}

      <button onClick={reload} disabled={isLoading}>
        Regenerate last response
      </button>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  )
}
```

### Integration with Database

Here's a complete example that saves messages to the database:

```tsx
import { useChatAI } from '@renderer/hooks/use-chat-ai'
import { useMessages, useCreateMessage } from '@renderer/hooks/use-message'
import { useUpdateChat } from '@renderer/hooks/use-chat'

function ChatPage({ chatId }: { chatId: number }) {
  const { messages: dbMessages } = useMessages(chatId)
  const createMessage = useCreateMessage()
  const updateChat = useUpdateChat()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChatAI({
    // Load initial messages from database
    initialMessages: dbMessages?.map(m => ({
      id: m.id.toString(),
      role: m.role,
      content: m.content,
      createdAt: m.createdAt
    })) || [],

    // Save assistant messages when complete
    onFinish: async (message) => {
      await createMessage.mutateAsync({
        chatId,
        role: 'assistant',
        content: message.content
      })

      // Update chat timestamp
      await updateChat.mutateAsync({
        id: chatId,
        data: {}
      })
    }
  })

  // Custom submit that saves user message
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Save user message to database
    await createMessage.mutateAsync({
      chatId,
      role: 'user',
      content: input
    })

    // Let useChatAI handle the rest
    await handleSubmit(e)
  }

  return (
    <div>
      {/* Render messages */}
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}

      {/* Form */}
      <form onSubmit={handleChatSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}
```

## API Reference

### `useChatAI(options?)`

Returns an object with the following properties:

#### State
- `messages: Message[]` - Array of messages in the conversation
- `input: string` - Current input value
- `isLoading: boolean` - Whether AI is currently generating a response
- `error: Error | null` - Error object if something went wrong

#### Methods
- `append(message)` - Add a message and get AI response
- `reload()` - Regenerate the last assistant message
- `stop()` - Stop the current generation
- `setInput(value)` - Set the input value
- `setMessages(messages)` - Replace all messages
- `handleSubmit(event)` - Form submit handler
- `handleInputChange(event)` - Input change handler

#### Options
```typescript
interface UseChatOptions {
  initialMessages?: Message[]
  onFinish?: (message: Message) => void
  onError?: (error: Error) => void
}
```

### Message Type

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
}
```

## Configuration

### Setting up API Key

Make sure users configure their OpenRouter API key in settings:

```typescript
import { useSettings, useUpdateSettings } from '@renderer/hooks/use-settings'

function SettingsPage() {
  const { settings } = useSettings()
  const updateSettings = useUpdateSettings()

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      await updateSettings.mutateAsync({
        apiKey: formData.get('apiKey') as string,
        apiKeyType: 'openrouter'
      })
    }}>
      <input name="apiKey" defaultValue={settings?.apiKey} />
      <button type="submit">Save</button>
    </form>
  )
}
```

### Changing Models

The default model is `anthropic/claude-3.5-sonnet`. To use a different model, you'll need to modify the backend handler or add model selection to the schema.

Available models at [OpenRouter](https://openrouter.ai/models):
- `anthropic/claude-3.5-sonnet` (default)
- `anthropic/claude-3-opus`
- `anthropic/claude-3-haiku`
- `openai/gpt-4-turbo`
- `openai/gpt-4`
- And many more

## Next Steps

Now that you have AI streaming set up, consider adding:

1. **UI Components** - Use AI SDK's UI elements (check [AI SDK Elements](https://ai-sdk.dev/elements))
2. **Tools/Functions** - Add function calling capabilities
3. **RAG** - Integrate with your project folders for context
4. **Attachments** - Add file upload support for images/documents
5. **Model Selection** - Let users choose their preferred model
6. **Streaming Markdown** - Render markdown as it streams in

## Troubleshooting

**"API key not configured"**
→ Make sure the user has set their OpenRouter API key in settings.

**Messages not streaming**
→ Check browser console for IPC errors. Ensure the main process is running.

**Type errors**
→ Run `pnpm typecheck` to verify all types are correct.

## Resources

- [Vercel AI SDK Docs](https://ai-sdk.dev/)
- [AI SDK Elements](https://ai-sdk.dev/elements)
- [OpenRouter API](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
