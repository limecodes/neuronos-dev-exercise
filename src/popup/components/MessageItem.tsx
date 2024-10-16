import { ReactNode } from 'react'
import TimeAgo from 'timeago-react'
import PriorityBadge from './PriorityBadge'

type MessageItemProps = {
  content: string
  timestamp: string
  priority: 'low' | 'high'
  variant: 'bold' | 'normal'
  addOnAfter?: ReactNode
}

type MessageVariantProps = Omit<MessageItemProps, 'variant'>

export default function MessageItem({ variant, ...props }: MessageItemProps) {
  return variant === 'bold' ? (
    <MessageBold {...props} />
  ) : (
    <MessageNormal {...props} />
  )
}

function MessageBold({
  content,
  timestamp,
  priority,
  addOnAfter,
}: MessageVariantProps) {
  return (
    <li className="bg-white border rounded-lg p-4 shadow-md flex justify-between items-start space-x-4">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-lg text-gray-800 truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {content}
        </p>
        <TimeAgo datetime={timestamp} className="text-sm text-gray-500" />
      </div>
      <div className="flex items-center space-x-2">
        <PriorityBadge priority={priority} />
        {addOnAfter}
      </div>
    </li>
  )
}

function MessageNormal({
  content,
  timestamp,
  priority,
  addOnAfter,
}: MessageVariantProps) {
  return (
    <li className="bg-gray-50 border rounded-lg p-4 shadow-md flex justify-between items-start space-x-4">
      <div className="flex-1 min-w-0">
        <p className="text-gray-600 truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {content}
        </p>
        <TimeAgo datetime={timestamp} className="text-sm text-gray-500" />
      </div>
      <div className="flex items-center space-x-2">
        <PriorityBadge priority={priority} />
        {addOnAfter}
      </div>
    </li>
  )
}
