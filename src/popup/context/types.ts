import { Message, SortOptions } from '../../types'

export type MessagesState = {
  messages: Message[]
  sortBy: SortOptions
  hasMessages: boolean
  numUnreadMessages: number
  error?: string
}

export type InitialState = Pick<MessagesState, 'messages' | 'sortBy'>

export type ReducerState = { messages: Message[]; error?: string }

export type ReducerAction =
  | { type: 'ADD_MESSAGES'; messages: Message[] }
  | { type: 'UPDATE_MESSAGE'; id: string; message: Partial<Message> }
  | { type: 'ERROR'; error: string; id: string; prevMessage: Partial<Message> }

export type MessagesActions = {
  update: (id: string, message: Partial<Message>) => void
  sort: (sortBy: SortOptions) => void
}

export type MessagesContextType = [MessagesState, MessagesActions]
