import Messages from '../lib/Messages'
import type { EventMessage, Message } from '../types'
import { handleUpdateBadge } from './handleUpdateBadge'

type UpdateArgs = Omit<EventMessage, 'action' | 'prevMessage'>

/**
 * Handler for updating messages (e.g. read status)
 * Used in the background script on message update events
 * @param UpdateArgs({ id, message: updatedFields })
 * @param onUpdated - Callback function to run after messages are updated
 * @returns void
 */
export async function handleUpdateMessages(
  { id, message: updatedFields }: UpdateArgs,
  onUpdated?: (updatedMessages: Message[]) => void,
  onFailed?: (error: string) => void,
) {
  const updatedMessages = await Messages.update(id, updatedFields)

  if (updatedMessages.length === 0) {
    const err = 'Failed to save updated messages'
    console.error(err)
    onFailed?.(err)

    return
  }

  onUpdated?.(updatedMessages)
  handleUpdateBadge(updatedMessages)
}
