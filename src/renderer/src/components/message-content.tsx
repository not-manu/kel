import Markdown from 'react-markdown'
import { cn } from '@renderer/lib/utils'

interface MessageContentProps {
  content: string
  className?: string
}

export function MessageContent({ content, className }: MessageContentProps) {
  return (
    <div className={cn('prose prose-sm prose-invert max-w-none', className)}>
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="font-semibold mb-2 mt-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="font-semibold mb-2 mt-4 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 mb-2 marker:text-f-500">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 mb-2 marker:text-f-500">{children}</ol>
          ),
          code: ({ className, children }) =>
            className ? (
              <code className="block bg-f-900 rounded px-2 py-1.5 my-2 overflow-x-auto">
                {children}
              </code>
            ) : (
              <code className="bg-f-900 rounded px-1 py-0.5">{children}</code>
            ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} className="text-f-300 hover:text-f-100 underline">
              {children}
            </a>
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
