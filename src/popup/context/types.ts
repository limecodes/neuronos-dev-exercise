import { Message, SortOptions } from '../../types'

export type MessagesState = {
  messages: Message[]
  hasMessages: boolean
  sortBy: SortOptions
}

export type ReducerState = Omit<MessagesState, 'hasMessages'>

export type ReducerAction =
  | { type: 'ADD_MESSAGES'; messages: Message[] }
  | { type: 'UPDATE_MESSAGE'; id: string; message: Partial<Message> }
  | { type: 'SORT_BY_UNREAD' }
  | { type: 'SORT_BY_PRIORITY' }
  | { type: 'SORT_BY_TIMESTAMP' }

export type MessagesActions = {
  updateMessage: (id: string, message: Partial<Message>) => void
  sortMessages: (sortBy: SortOptions) => void
}

export type MessagesContextType = [MessagesState, MessagesActions]
