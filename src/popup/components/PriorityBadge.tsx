import type { Message } from '../../types'

export default function PriorityBadge({
  priority,
}: {
  priority: Message['priority']
}) {
  const { text, style } = {
    low: {
      text: 'Low Priority',
      style: 'bg-green-100 text-green-500',
    },
    high: {
      text: 'High Priority',
      style: 'bg-red-100 text-red-500',
    },
  }[priority]

  return (
    <span className={`${style} px-2 py-1 rounded text-xs font-medium`}>
      {text}
    </span>
  )
}
