import Messages from '../lib/Messages'
import type { Message } from '../types'
import { handleUpdateBadge } from './handleUpdateBadge'

/**
 * Handler for fetching and saving messages to be used when installing
 * and listening for updates when the extension is running
 * @param onSaved - Callback function to run after messages are saved
 * @returns
 */
export async function handleNewMessages(
  onSaved?: (messages: Message[]) => void,
) {
  const storedMessages = await Messages.get()
  const latestStoredId = storedMessages[0]?.id || null

  const newMessages = await Messages.fetch(latestStoredId)

  if (!newMessages.length) {
    console.log('No new messages')
    return
  }

  const messages = [...storedMessages, ...newMessages]
  const saved = await Messages.set(messages)

  if (saved) {
    console.log('Messages saved successfully')
    onSaved?.(messages)
  }

  handleUpdateBadge(messages)
}
