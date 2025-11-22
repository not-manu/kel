import Markdown from 'react-markdown'

interface MessageContentProps {
  content: string
  className?: string
}

export function MessageContent({ content, className }: MessageContentProps) {
  return (
    <div className={className}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
