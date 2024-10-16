import { createMockedResponse } from '../mocks'
import type { Message } from '../types'
import type { ErrorType, ResponseType, Variables } from './types'

/**
 * Fetch messages from the server (simulates paginated requests)
 * @param cursor - The cursor to start from (assuming server will paginate)
 * @param limit - The number of messages to fetch (usually we ask the server for a limit)
 * @returns
 */
async function fetch({ cursor, limit = 5 }: Variables): Promise<Response> {
  const mockedMessages = await createMockedResponse({
    max: limit,
    lastMessageId: cursor,
  })

  return Promise.resolve(
    new Response(
      JSON.stringify({
        messages: mockedMessages,
        pageInfo: { cursor, count: mockedMessages.length },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    ),
  )
}

/**
 * Gets the messages from the server by latest store id
 * @param latestStoredId
 * @returns ResponseType<ReturnType> | ErrorType
 */
async function get<ReturnType>(
  latestStoredId: Message['id'] | null = null,
): Promise<ResponseType<ReturnType> | ErrorType> {
  try {
    const response = await fetch({ cursor: latestStoredId })

    return (await response.json()) as ResponseType<ReturnType>
  } catch (error) {
    console.error('Error getting messages', error)

    return { error: 'Failed to fetch messages' }
  }
}

export default {
  get,
}
