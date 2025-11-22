import { useChat } from '@renderer/hooks/use-chat';
import { useTitlebar } from '@renderer/hooks/use-titlebar';
import { useParams } from 'react-router-dom'

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const chat = useChat(Number(id));

  useTitlebar({ title: chat.data ? chat.data.title : 'New Chat' });

  return <div className='flex-grow'>Hi! {id}</div>
}
