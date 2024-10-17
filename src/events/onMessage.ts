import { handleUpdateMessages } from '../handlers'
import type { EventMessage, EventResponse } from '../types'

export function onMessage(
  { action, id, message: updatedFields, prevMessage }: EventMessage,
  _: chrome.runtime.MessageSender,
  sendResponse: (response: EventResponse) => void,
) {
  if (action === 'UPDATE_MESSAGE') {
    ;(async () => {
      await handleUpdateMessages(
        { id, message: updatedFields },
        messages => sendResponse({ success: true, messages }),
        error => sendResponse({ success: false, id, prevMessage, error }),
      )
    })()

    return true
  }
}
