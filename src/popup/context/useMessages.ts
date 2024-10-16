import { useContext } from 'react'
import { MessagesContext } from './context'
import type { MessagesContextType } from './types'

export function useMessages(): MessagesContextType {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
}
