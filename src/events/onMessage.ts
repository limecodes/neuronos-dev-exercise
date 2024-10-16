import { handleUpdateMessages } from '../handlers'
import type { EventMessage } from '../types'

export async function onMessage({
  action,
  id,
  message: updatedFields,
}: EventMessage) {
  if (action === 'UPDATE_MESSAGE') {
    handleUpdateMessages({ id, message: updatedFields })
  }
}
