import { useState, useCallback, useRef } from 'react'
import type { ChatRequest } from '@shared/schemas'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
}

export interface UseChatOptions {
  initialMessages?: Message[]
  onFinish?: (message: Message) => void
  onError?: (error: Error) => void
}

/**
 * Custom hook that mimics AI SDK's useChat but works with Electron IPC
 * Provides a familiar API for chat interactions with streaming support
 */
export function useChatAI(options: UseChatOptions = {}) {
  const { initialMessages = [], onFinish, onError } = options

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const cancelFnRef = useRef<(() => void) | null>(null)
  const messageIdCounter = useRef(0)

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${messageIdCounter.current++}`
  }, [])

  const append = useCallback(
    async (message: Message | { role: 'user' | 'assistant' | 'system'; content: string }) => {
      const newMessage: Message = 'id' in message
        ? message
        : {
            ...message,
            id: generateId(),
            createdAt: new Date()
          }

      // Add user message immediately
      setMessages((prev) => [...prev, newMessage])
      setIsLoading(true)
      setError(null)

      // Create assistant message placeholder
      const assistantMessageId = generateId()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date()
      }

      setMessages((prev) => [...prev, assistantMessage])

      try {
        const request: ChatRequest = {
          messages: [...messages, newMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }

        const { cancel } = await window.api.ai.chat(
          request,
          (chunk: { type: string; value: string }) => {
            if (chunk.type === 'text') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + chunk.value }
                    : msg
                )
              )
            }
          },
          (result: { text: string; usage?: any; finishReason?: string }) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: result.text }
                  : msg
              )
            )
            setIsLoading(false)
            cancelFnRef.current = null

            const finalMessage: Message = {
              id: assistantMessageId,
              role: 'assistant',
              content: result.text,
              createdAt: new Date()
            }
            onFinish?.(finalMessage)
          },
          (err: Error) => {
            setError(err)
            setIsLoading(false)
            cancelFnRef.current = null
            onError?.(err)

            // Remove the placeholder message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
          }
        )

        cancelFnRef.current = cancel
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        setError(error)
        setIsLoading(false)
        onError?.(error)

        // Remove the placeholder message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
      }
    },
    [messages, generateId, onFinish, onError]
  )

  const reload = useCallback(async () => {
    if (messages.length === 0) return

    // Remove last assistant message and resend
    const lastAssistantIndex = messages.findLastIndex((m) => m.role === 'assistant')
    if (lastAssistantIndex === -1) return

    const messagesToKeep = messages.slice(0, lastAssistantIndex)
    setMessages(messagesToKeep)

    // Resend from the last user message
    const lastUserMessage = [...messagesToKeep].reverse().find((m) => m.role === 'user')
    if (lastUserMessage) {
      await append(lastUserMessage)
    }
  }, [messages, append])

  const stop = useCallback(() => {
    if (cancelFnRef.current) {
      cancelFnRef.current()
      cancelFnRef.current = null
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()
      if (!input.trim() || isLoading) return

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: input,
        createdAt: new Date()
      }

      setInput('')
      await append(userMessage)
    },
    [input, isLoading, generateId, append]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  return {
    messages,
    input,
    isLoading,
    error,
    append,
    reload,
    stop,
    setInput,
    setMessages,
    handleSubmit,
    handleInputChange
  }
}
