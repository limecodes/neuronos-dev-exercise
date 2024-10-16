import Messages from '../lib/Messages'
import type { EventMessage, Message } from '../types'
import { handleUpdateBadge } from './handleUpdateBadge'

type UpdateArgs = Omit<EventMessage, 'action'>

/**
 * Handler for updating messages (e.g. read status)
 * Used in the background script on message update events
 * @param UpdateArgs({ id, message: updatedFields })
 * @param onUpdated - Callback function to run after messages are updated
 * @returns void
 */
export async function handleUpdateMessages(
  { id, message: updatedFields }: UpdateArgs,
  onUpdated?: (messages: Message[]) => void,
) {
  const storedMessages = await Messages.get()

  const updatedMessages = storedMessages.map(message => {
    if (message.id === id) {
      return { ...message, ...updatedFields }
    }

    return message
  })

  const saved = await Messages.set(updatedMessages)

  if (saved) {
    onUpdated?.(updatedMessages)
    handleUpdateBadge(updatedMessages)
  }
}
