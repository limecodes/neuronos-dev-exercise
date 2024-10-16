import type { Message } from '../types'
import API from './API'
import { STORAGE_KEY } from './constants'
import Storage from './Storage'

/**
 * Returns messages stored locally and sorted by timestamp
 * @returns Message[]
 */
async function get(): Promise<Message[]> {
  try {
    const storedMessages = await Storage.get<Message[]>(STORAGE_KEY)

    const sortedMessages = storedMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return sortedMessages
  } catch (error) {
    console.error('Error fetching messages:', error)

    return []
  }
}

/**
 * Saves messages to local storage
 * @param messages - Messages to store
 * @returns boolean
 */
async function set(messages: Message[]): Promise<boolean> {
  try {
    await Storage.set<Message[]>(STORAGE_KEY, messages)

    return true
  } catch (error) {
    console.error('Error saving messages:', error)

    return false
  }
}

/**
 * Fetches messages from the (mocked) API
 * @param latestStoredId - The latest stored message ID
 * @returns Message[]
 */
async function fetch(latestStoredId: string | null): Promise<Message[]> {
  const response = await API.get<Message[]>(latestStoredId)

  if ('error' in response) {
    console.error('Error fetching messages:', response.error)

    return []
  }

  return response.messages
}

/**
 * Gets a message by ID
 * @param id - The message ID
 * @returns Message | undefined
 */
async function getById(id: string): Promise<Message | undefined> {
  try {
    const storedMessages = await get()

    return storedMessages.find(message => message.id === id)
  } catch (error) {
    console.error('Error fetching messages:', error)

    return undefined
  }
}

/**
 * Returns the number of unread messages
 * @param messages - Messages to check, if not provided, fetches from local storage
 * @returns number
 */
async function getUnreadCount(messages?: Message[]): Promise<number> {
  const resolvedMessages = messages || (await get())

  return resolvedMessages.filter(message => !message.read).length
}

/**
 * Updates a message by ID
 * @param id - The message ID
 * @param updatedFields - Fields to update
 * @returns boolean
 * @throws Error if no messages found
 */
async function update(
  id: string,
  updatedFields: Partial<Message>,
): Promise<boolean> {
  try {
    const storedMessages = await get()

    if (storedMessages.length === 0) {
      throw new Error('No messages found, possibly an error in storage')
    }

    const updatedMessages = storedMessages.map(message => {
      if (message.id === id) {
        return { ...message, ...updatedFields }
      }

      return message
    })

    await set(updatedMessages)

    return true
  } catch (error) {
    console.error('Error updating message:', error)

    return false
  }
}

export default {
  get,
  set,
  update,
  fetch,
  getById,
  getUnreadCount,
}
