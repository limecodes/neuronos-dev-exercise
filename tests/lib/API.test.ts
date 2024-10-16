import { faker } from '@faker-js/faker'

import API from '../../src/lib/API'
import type { Message } from '../../src/types'

jest.mock('@faker-js/faker', () => {
  const actualFaker = jest.requireActual('@faker-js/faker')
  return {
    ...actualFaker,
    faker: {
      ...actualFaker.faker,
      date: {
        ...actualFaker.faker.date,
        betweens: jest.fn(),
      },
      lorem: {
        ...actualFaker.faker.lorem,
        sentence: jest.fn(),
      },
    },
  }
})

describe('API', () => {
  describe('get', () => {
    it.only('should return at least one mocked message by default starting from no stored messages', async () => {
      const fakeTimestamps = [new Date('2024-10-15T12:00:00Z')]
      ;(faker.date.betweens as jest.Mock).mockReturnValue(fakeTimestamps)
      ;(faker.lorem.sentence as jest.Mock).mockReturnValue(
        'Test message content',
      )

      const response = await API.get<Message[]>(null)

      expect(response).toEqual({
        messages: [
          {
            id: 'msg1',
            timestamp: '2024-10-15T12:00:00.000Z',
            content: 'Test message content',
            priority: expect.any(String),
            read: false,
          },
        ],
        pageInfo: {
          cursor: null,
          count: 1,
        },
      })
    })
  })
  it('should return multiple mocked messages starting from no stored messages', async () => {
    const fakeTimestamps = [
      new Date('2024-10-15T12:00:00Z'),
      new Date('2024-10-15T13:00:00Z'),
    ]
    ;(faker.date.betweens as jest.Mock).mockReturnValue(fakeTimestamps)
    ;(faker.lorem.sentence as jest.Mock)
      .mockReturnValueOnce('Message 1')
      .mockReturnValueOnce('Message 2')

    const response = await API.get<Message>(null)

    expect(response).toEqual({
      messages: [
        {
          id: 'msg1',
          timestamp: '2024-10-15T12:00:00.000Z',
          content: 'Message 1',
          priority: expect.any(String),
          read: false,
        },
        {
          id: 'msg2',
          timestamp: '2024-10-15T13:00:00.000Z',
          content: 'Message 2',
          priority: expect.any(String),
          read: false,
        },
      ],
      pageInfo: {
        cursor: null,
        count: 2,
      },
    })
  })

  it('should increment the id of the last message when stored messages exist', async () => {
    const fakeTimestamps = [
      new Date('2024-10-15T12:00:00Z'),
      new Date('2024-10-15T13:00:00Z'),
    ]

    ;(faker.date.betweens as jest.Mock).mockReturnValue(fakeTimestamps)
    ;(faker.lorem.sentence as jest.Mock)
      .mockReturnValueOnce('Message 1')
      .mockReturnValueOnce('Message 2')

    const response = await API.get<Message>('msg1')

    expect(response).toEqual({
      messages: [
        {
          id: 'msg2',
          timestamp: '2024-10-15T12:00:00.000Z',
          content: 'Message 1',
          priority: expect.any(String),
          read: false,
        },
        {
          id: 'msg3',
          timestamp: '2024-10-15T13:00:00.000Z',
          content: 'Message 2',
          priority: expect.any(String),
          read: false,
        },
      ],
      pageInfo: {
        cursor: 'msg1',
        count: 2,
      },
    })
  })

  it('should handle errors during message fetching', async () => {
    ;(faker.date.betweens as jest.Mock).mockImplementation(() => {
      throw new Error('Random error')
    })

    const response = await API.get<Message>('msg1')

    expect(response).toEqual({ error: 'Failed to fetch messages' })
  })
})
