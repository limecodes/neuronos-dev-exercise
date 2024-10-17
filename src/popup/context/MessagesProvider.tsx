import { ReactNode, useReducer, useEffect, useMemo, useState } from 'react'
import type { Message, SortOptions } from '../../types'
import type { InitialState, MessagesContextType } from './types'
import { MessagesContext } from './context'
import { messagesReducer } from './reducer'
import { sortMessages } from './helpers'

type MessageProviderProps = InitialState & {
  children: ReactNode
}

export default function MessagesProvider({
  messages: initialMessages = [],
  sortBy: initialSortBy = 'timestamp',
  children,
}: MessageProviderProps) {
  const [sortBy, setSortBy] = useState<SortOptions>(initialSortBy)
  const [{ messages, error }, dispatch] = useReducer<typeof messagesReducer>(
    messagesReducer,
    { messages: initialMessages },
  )
  const hasMessages = useMemo(() => messages.length > 0, [messages])
  const numUnreadMessages = useMemo(
    () => messages.filter(message => !message.read).length,
    [messages],
  )
  const sortedMessages = useMemo(
    () => sortMessages(messages, sortBy, numUnreadMessages > 0),
    [messages, sortBy, numUnreadMessages],
  )

  useEffect(() => {
    chrome.runtime.onMessage.addListener(event => {
      if (event.action === 'NEW_MESSAGES') {
        dispatch({ type: 'ADD_MESSAGES', messages: event.messages })
      }
    })
  }, [])

  function update(id: string, message: Partial<Message>) {
    console.log('Updating message in the context')
    const prevMessage = messages.find(msg => msg.id === id)
    dispatch({ type: 'UPDATE_MESSAGE', id, message })

    chrome.runtime.sendMessage(
      {
        action: 'UPDATE_MESSAGE',
        id,
        message,
        prevMessage,
      },
      response => {
        console.log({ response })
        if (response && !response.success) {
          console.error('Failed to update message in the background')
          dispatch({
            type: 'ERROR',
            error: response.error,
            id,
            prevMessage: response.prevMessage,
          })
        }
      },
    )
  }

  function sort(sortBy: SortOptions) {
    const sortFunctions = {
      timestamp: () => setSortBy('timestamp'),
      unread: () => setSortBy('unread'),
      priority: () => setSortBy('priority'),
    }

    sortFunctions[sortBy]()
  }

  const value: MessagesContextType = [
    { messages: sortedMessages, error, sortBy, hasMessages, numUnreadMessages },
    { update, sort },
  ]

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}
