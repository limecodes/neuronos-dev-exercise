import { handleUpdateBadge } from '../../src/handlers/handleUpdateBadge'
import { handleUpdateMessages } from '../../src/handlers/handleUpdateMessages'
import Messages from '../../src/lib/Messages'
import type { Message } from '../../src/types'

jest.mock('../../src/handlers/handleUpdateBadge')

describe('handleUpdateMessages', () => {
  let originalGet: typeof chrome.storage.local.get

  beforeEach(() => {
    jest.clearAllMocks()
    originalGet = chrome.storage.local.get

    jest.spyOn(Messages, 'update')
  })

  afterEach(() => {
    chrome.storage.local.get = originalGet
    jest.restoreAllMocks()
  })

  it('should update a message and save it to storage', async () => {
    const mockStoredMessages: Message[] = [
      {
        id: 'msg1',
        content: 'Message 1',
        priority: 'high',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 'msg2',
        content: 'Message 2',
        priority: 'low',
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]

    chrome.storage.local.get = jest
      .fn()
      .mockImplementation((keys, callback) => {
        const key = typeof keys === 'string' ? keys : Object.keys(keys)[0]
        callback({ [key]: mockStoredMessages })
      })

    const updatedMessageFields = { read: true }
    const updatedMessage = { id: 'msg1', message: updatedMessageFields }

    const onUpdatedSpy = jest.fn()

    await handleUpdateMessages(updatedMessage, onUpdatedSpy)

    expect(Messages.update).toHaveBeenCalledWith(
      updatedMessage.id,
      updatedMessageFields,
    )
    expect(onUpdatedSpy).toHaveBeenCalledWith([
      {
        ...mockStoredMessages[0],
        ...updatedMessageFields,
      },
      mockStoredMessages[1],
    ])
    expect(handleUpdateBadge).toHaveBeenCalledWith([
      {
        ...mockStoredMessages[0],
        ...updatedMessageFields,
      },
      mockStoredMessages[1],
    ])
  })

  it('should not update the badge or call onUpdated if saving messages fails', async () => {
    const mockStoredMessages: Message[] = [
      {
        id: 'msg1',
        content: 'Message 1',
        priority: 'high',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 'msg2',
        content: 'Message 2',
        priority: 'low',
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]

    chrome.storage.local.get = jest
      .fn()
      .mockImplementation((keys, callback) => {
        const key = typeof keys === 'string' ? keys : Object.keys(keys)[0]
        callback({ [key]: mockStoredMessages })
      })

    const updatedMessageFields = { read: true }
    const updatedMessage = { id: 'msg1', message: updatedMessageFields }

    jest.spyOn(Messages, 'update').mockResolvedValue([])

    const onUpdatedSpy = jest.fn()

    await handleUpdateMessages(updatedMessage, onUpdatedSpy)

    expect(Messages.update).toHaveBeenCalledWith('msg1', updatedMessageFields)
    expect(onUpdatedSpy).not.toHaveBeenCalled()
    expect(handleUpdateBadge).not.toHaveBeenCalled()
  })
})
