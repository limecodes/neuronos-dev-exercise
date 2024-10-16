import { ReactNode, useReducer, useEffect, useMemo } from 'react'
import type { Message, SortOptions } from '../../types'
import type { MessagesState, MessagesContextType } from './types'
import { MessagesContext } from './context'
import { messagesReducer } from './reducer'

type MessageProviderProps = Pick<MessagesState, 'messages'> & {
  children: ReactNode
}

export default function MessagesProvider({
  messages: initialMessages = [],
  children,
}: MessageProviderProps) {
  const [{ messages, sortBy }, dispatch] = useReducer<typeof messagesReducer>(
    messagesReducer,
    {
      messages: initialMessages,
      sortBy: 'unread',
    },
  )
  const hasMessages = useMemo(() => messages.length > 0, [messages])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(event => {
      if (event.action === 'NEW_MESSAGES') {
        dispatch({ type: 'ADD_MESSAGES', messages: event.messages })
      }
    })
  }, [])

  function updateMessage(id: string, message: Partial<Message>) {
    dispatch({ type: 'UPDATE_MESSAGE', id, message })

    chrome.runtime.sendMessage(
      { action: 'UPDATE_MESSAGE', id, message },
      response => {
        if (response?.success) {
          console.log('Message successfully updated in the background')
        } else {
          console.error('Failed to update message in the background')
        }
      },
    )
  }

  function sortMessages(sortBy: SortOptions) {
    const sortFunctions = {
      timestamp: () => dispatch({ type: 'SORT_BY_TIMESTAMP' }),
      unread: () => dispatch({ type: 'SORT_BY_UNREAD' }),
      priority: () => dispatch({ type: 'SORT_BY_PRIORITY' }),
    }

    sortFunctions[sortBy]()
  }

  const value: MessagesContextType = [
    { messages, sortBy, hasMessages },
    { updateMessage, sortMessages },
  ]

  return (
    <MessagesContext.Provider value={value}>
      <p>{JSON.stringify(messages)}</p>
      {children}
    </MessagesContext.Provider>
  )
}
