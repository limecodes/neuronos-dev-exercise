import type { ReducerState, ReducerAction } from './types'

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
        messages: updatedMessages,
      }
    }

    case 'UPDATE_MESSAGE': {
      const updatedMessages = state.messages.map(message =>
        message.id === action.id ? { ...message, ...action.message } : message,
      )

      return {
        ...state,
        messages: updatedMessages,
      }
    }

    default:
      return state
  }
}
