import { faker } from '@faker-js/faker'

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
  // TODO: This is important to return to later as I'm paginating by timestamp
  const lastMessageTimestamp = getLatestTimestamp()

  // This ensures that we have sequential timestamps
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
 * Used later for retrieving the latest timestamp for pagination
 * @returns string
 */
function getLatestTimestamp(): string {
  return new Date().toISOString()
}
