import { Message, SortOptions } from '../../types'

export type MessagesState = {
  messages: Message[]
  sortBy: SortOptions
  hasMessages: boolean
  numUnreadMessages: number
}

export type InitialState = Pick<MessagesState, 'messages' | 'sortBy'>

export type ReducerState = { messages: Message[] }

export type ReducerAction =
  | { type: 'ADD_MESSAGES'; messages: Message[] }
  | { type: 'UPDATE_MESSAGE'; id: string; message: Partial<Message> }
  | { type: 'SORT_BY_UNREAD' }
  | { type: 'SORT_BY_PRIORITY' }
  | { type: 'SORT_BY_TIMESTAMP' }

export type MessagesActions = {
  update: (id: string, message: Partial<Message>) => void
  sort: (sortBy: SortOptions) => void
}

export type MessagesContextType = [MessagesState, MessagesActions]
