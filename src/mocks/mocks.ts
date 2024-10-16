import { faker } from '@faker-js/faker'

import Messages from '../lib/Messages'
import type { Message } from '../types'
import type {
  CreateMockedResponseOptions,
  CreateRandomMessageOptions,
} from './types'

/**
 * Creates a mocked server response with random messages
 * @param max - The maximum number of messages to generate
 * @param lastMessageId - The ID of the last stored message
 * @returns Message[]
 */
export async function createMockedResponse({
  max,
  lastMessageId,
}: Omit<CreateMockedResponseOptions, 'lastMessageTimestamp'>): Promise<
  Message[]
> {
  const count = faker.number.int({ min: 1, max })
  let currentMessageId = lastMessageId

  const now = new Date()
  const lastMessageTimestamp = await getLatestTimestamp(lastMessageId)

  const timestamps = faker.date.betweens({
    from: lastMessageTimestamp
      ? new Date(lastMessageTimestamp)
      : faker.date.recent(),
    to: now,
    count,
  })

  return timestamps.map(timestamp => {
    const message = createRandomMessage({
      lastMessageId: currentMessageId,
      lastMessageTimestamp: timestamp,
    })
    currentMessageId = message.id
    return message
  })
}

/**
 * Creates a random message as a mock server response
 * @param lastMessageId
 * @param lastMessageTimestamp
 * @returns Message
 */
function createRandomMessage({
  lastMessageId,
  lastMessageTimestamp,
}: CreateRandomMessageOptions): Message {
  const id = incrementId(lastMessageId || 'msg0')

  return {
    id,
    timestamp: lastMessageTimestamp.toISOString(),
    content: faker.lorem.sentence(),
    priority: faker.helpers.arrayElement(['high', 'low']),
    read: false,
  }
}

/**
 * Increments the message ID
 * @param id
 * @returns string
 */
function incrementId(id: string): string {
  const prefix = 'msg'
  const num = Number(id.replace(prefix, ''))

  return `${prefix}${num + 1}`
}

/**
 * Gets the latest timestamp from the last message
 * @param lastMessageId
 * @returns string | null
 */
async function getLatestTimestamp(
  lastMessageId: string | null,
): Promise<string | null> {
  if (!lastMessageId) {
    return null
  }

  const latestMessage = await Messages.getById(lastMessageId)

  return latestMessage ? latestMessage.timestamp : null
}
