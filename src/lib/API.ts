import { createMockedResponse } from '../mocks'
import type { Message } from '../types'
import type { ErrorType,ResponseType, Variables } from './types'

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
