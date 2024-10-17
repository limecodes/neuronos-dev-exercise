import type { Message, SortOptions } from '../../types'

export const sortMessages = (messages: Message[], sortBy: SortOptions) => {
  if (sortBy === 'priority') {
    return [...messages].sort((a, b) => {
      const priorityOrder = { high: 1, low: 2 }
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
    })
  } else if (sortBy === 'unread') {
    return [...messages].sort((a, b) => Number(a.read) - Number(b.read))
  } else if (sortBy === 'timestamp') {
    return [...messages].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }
  return messages
}