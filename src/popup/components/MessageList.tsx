import type { Message } from '../../types'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: Message[]
  onUpdateMessage: (id: string, message: Partial<Message>) => void
}

export default function MessageList({
  messages,
  onUpdateMessage,
}: MessageListProps) {
  function handleMarkAsRead(id: string) {
    onUpdateMessage(id, { read: true })
  }

  return (
    <ul role="list" className="space-y-4">
      {messages.map(({ id, content, timestamp, priority, read }) => (
        <MessageItem
          key={id}
          content={content}
          timestamp={timestamp}
          priority={priority}
          variant={read ? 'normal' : 'bold'}
          addOnAfter={
            !read && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                onClick={() => handleMarkAsRead(id)}
              >
                Mark as Read
              </button>
            )
          }
        />
      ))}
    </ul>
  )
}
