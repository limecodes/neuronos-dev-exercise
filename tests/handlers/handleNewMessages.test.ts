import { faker } from '@faker-js/faker'

import { handleNewMessages } from '../../src/handlers/handleNewMessages'
import Messages from '../../src/lib/Messages'
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
      helpers: {
        ...actualFaker.faker.helpers,
        arrayElement: jest.fn(),
      },
    },
  }
})

describe('handleNewMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(Messages, 'get')
    jest.spyOn(Messages, 'fetch')
    jest.spyOn(Messages, 'set')
  })

  it('should return no new messages if faker returns no messages', async () => {
    ;(faker.date.betweens as jest.Mock).mockReturnValue([])
    ;(faker.lorem.sentence as jest.Mock).mockReturnValue('')

    // Check that when the handler runs, no new messages are fetched
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await handleNewMessages()

    expect(consoleSpy).toHaveBeenCalledWith('No new messages')
    expect(Messages.set).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should fetch and save new messages', async () => {
    const mockStoredMessages: Message[] = [
      {
        id: 'msg1',
        content: 'Stored message 1',
        priority: 'low',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]

    const originalGet = chrome.storage.local.get
    chrome.storage.local.get = jest
      .fn()
      .mockImplementation(
        (
          keys: string | object,
          callback: (items: { [key: string]: unknown }) => void,
        ) => {
          const key = typeof keys === 'string' ? keys : Object.keys(keys)[0]
          callback({ [key]: mockStoredMessages })
        },
      )

    const fakeTimestamps = [new Date('2024-10-15T12:00:00Z')]
    ;(faker.date.betweens as jest.Mock).mockReturnValue(fakeTimestamps)
    ;(faker.lorem.sentence as jest.Mock).mockReturnValue('New message content')
    ;(faker.helpers.arrayElement as jest.Mock).mockReturnValue('high')

    const storedMessages = await Messages.get()
    const newMessages = await Messages.fetch('msg1')

    const combinedMessages = [...storedMessages, ...newMessages]
    await Messages.set(combinedMessages)

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await handleNewMessages()

    expect(Messages.get).toHaveBeenCalled()
    expect(Messages.fetch).toHaveBeenCalledWith('msg1')
    expect(Messages.set).toHaveBeenCalledWith(combinedMessages)
    expect(consoleSpy).toHaveBeenCalledWith('Messages saved successfully')

    consoleSpy.mockRestore()
    chrome.storage.local.get = originalGet
  })

  it('should call onSaved callback with the saved messages', async () => {
    const mockStoredMessages: Message[] = [
      {
        id: 'msg1',
        content: 'Stored message 1',
        priority: 'low',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]

    const originalGet = chrome.storage.local.get
    chrome.storage.local.get = jest
      .fn()
      .mockImplementation(
        (
          keys: string | object,
          callback: (items: { [key: string]: unknown }) => void,
        ) => {
          const key = typeof keys === 'string' ? keys : Object.keys(keys)[0]
          callback({ [key]: mockStoredMessages })
        },
      )

    const fakeTimestamps = [new Date('2024-10-15T12:00:00Z')]
    ;(faker.date.betweens as jest.Mock).mockReturnValue(fakeTimestamps)
    ;(faker.lorem.sentence as jest.Mock).mockReturnValue('New message content')

    const storedMessages = await Messages.get()
    const newMessages = await Messages.fetch('msg1')

    const combinedMessages = [...storedMessages, ...newMessages]
    const onSavedMock = jest.fn()

    await handleNewMessages(onSavedMock)

    expect(onSavedMock).toHaveBeenCalledWith(combinedMessages)
    chrome.storage.local.get = originalGet
  })
})
