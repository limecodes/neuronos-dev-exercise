import { SortOptions } from '../../types'
import SortButton from './SortButton'

type SortControlProps = {
  sortBy: string
  hasUnreadMessages: boolean
  onSortMessages: (sortBy: SortOptions) => void
}

export default function SortControl({
  sortBy,
  hasUnreadMessages,
  onSortMessages,
}: SortControlProps) {
  const handleSortMessages = (sortBy: SortOptions) => () =>
    onSortMessages(sortBy)

  return (
    <div className="space-x-4">
      <SortButton
        isSelected={sortBy === 'unread'}
        onClick={handleSortMessages('unread')}
        disabled={!hasUnreadMessages}
      >
        Sort by Unread
      </SortButton>
      <SortButton
        isSelected={sortBy === 'timestamp'}
        onClick={handleSortMessages('timestamp')}
      >
        Sort by Timestamp
      </SortButton>
      <SortButton
        isSelected={sortBy === 'priority'}
        onClick={handleSortMessages('priority')}
      >
        Sort by Priority
      </SortButton>
    </div>
  )
}
