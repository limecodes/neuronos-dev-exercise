import type { Message, SortOptions } from '../../types'
import type { ReducerState, ReducerAction } from './types'

const sortMessages = (messages: Message[], sortBy: SortOptions) => {
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

export function messagesReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case 'ADD_MESSAGES': {
      const newMessageIds = new Set(action.messages.map(msg => msg.id))
      const filteredOldMessages = state.messages.filter(
        message => !newMessageIds.has(message.id),
      )

      const updatedMessages = [...filteredOldMessages, ...action.messages]

      return {
        ...state,
        messages: sortMessages(updatedMessages, state.sortBy),
      }
    }

    case 'UPDATE_MESSAGE': {
      const updatedMessages = state.messages.map(message =>
        message.id === action.id ? { ...message, ...action.message } : message,
      )

      return {
        ...state,
        messages: sortMessages(updatedMessages, state.sortBy),
      }
    }

    case 'SORT_BY_UNREAD': {
      return {
        ...state,
        sortBy: 'unread',
        messages: sortMessages(state.messages, 'unread'),
      }
    }

    case 'SORT_BY_PRIORITY': {
      return {
        ...state,
        sortBy: 'priority',
        messages: sortMessages(state.messages, 'priority'),
      }
    }

    case 'SORT_BY_TIMESTAMP': {
      return {
        ...state,
        sortBy: 'timestamp',
        messages: sortMessages(state.messages, 'timestamp'),
      }
    }

    default:
      return state
  }
}
