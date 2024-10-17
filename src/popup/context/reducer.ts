import type { ReducerState, ReducerAction } from './types'
import { sortMessages } from './helpers'

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

    default:
      return state
  }
}
