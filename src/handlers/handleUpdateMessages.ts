import Messages from '../lib/Messages'
import type { EventMessage, Message } from '../types'

type UpdateArgs = Omit<EventMessage, 'action'>

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
    console.log('Messages saved successfully')
    onUpdated?.(updatedMessages)
  }
}
