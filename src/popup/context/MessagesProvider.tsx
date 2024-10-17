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
  const [{ messages }, dispatch] = useReducer<typeof messagesReducer>(
    messagesReducer,
    { messages: initialMessages },
  )
  const hasMessages = useMemo(() => messages.length > 0, [messages])
  const sortedMessages = useMemo(
    () => sortMessages(messages, sortBy),
    [messages, sortBy],
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
    dispatch({ type: 'UPDATE_MESSAGE', id, message })

    chrome.runtime.sendMessage(
      { action: 'UPDATE_MESSAGE', id, message },
      response => {
        if (response?.success) {
          console.log('Message successfully updated in the background')
        } else {
          // TODO: Not handling a fallback for this error yet
          console.error('Failed to update message in the background')
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
    { messages: sortedMessages, sortBy, hasMessages },
    { update, sort },
  ]

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}
