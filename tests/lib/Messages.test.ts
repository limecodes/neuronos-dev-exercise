import API from '../../src/lib/API'
import { STORAGE_KEY } from '../../src/lib/constants'
import Messages from '../../src/lib/Messages'
import Storage from '../../src/lib/Storage'
import type { Message } from '../../src/types'

jest.mock('../../src/lib/Storage')
jest.mock('../../src/lib/API')

const mockMessages: Message[] = [
  {
    id: 'msg1',
    content: 'Test message 1',
    timestamp: '2024-10-15T12:51:57.204Z',
    priority: 'high',
    read: false,
  },
  {
    id: 'msg2',
    content: 'Test message 2',
    timestamp: '2024-10-14T12:51:57.204Z',
    priority: 'low',
    read: true,
  },
]

describe('Messages Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('should return sorted messages by timestamp', async () => {
      ;(Storage.get as jest.Mock).mockResolvedValue(mockMessages)

      const result = await Messages.get()

      expect(Storage.get).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result[0].id).toBe('msg1') // Message with the most recent timestamp
      expect(result[1].id).toBe('msg2')
    })

    it('should return an empty array if an error occurs', async () => {
      ;(Storage.get as jest.Mock).mockRejectedValue(new Error('Storage error'))

      const result = await Messages.get()

      expect(Storage.get).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result).toEqual([])
    })
  })

  describe('set', () => {
    it('should store messages and return true', async () => {
      ;(Storage.set as jest.Mock).mockResolvedValue(undefined)

      const result = await Messages.set(mockMessages)

      expect(Storage.set).toHaveBeenCalledWith(STORAGE_KEY, mockMessages)
      expect(result).toBe(true)
    })

    it('should return false if an error occurs', async () => {
      ;(Storage.set as jest.Mock).mockRejectedValue(new Error('Storage error'))

      const result = await Messages.set(mockMessages)

      expect(Storage.set).toHaveBeenCalledWith(STORAGE_KEY, mockMessages)
      expect(result).toBe(false)
    })
  })

  describe('fetch', () => {
    it('should fetch messages from API and return them', async () => {
      const mockApiResponse = { messages: mockMessages }
      ;(API.get as jest.Mock).mockResolvedValue(mockApiResponse)

      const result = await Messages.fetch('msg1')

      expect(API.get).toHaveBeenCalledWith('msg1')
      expect(result).toEqual(mockMessages)
    })

    it('should return an empty array if the API returns an error', async () => {
      ;(API.get as jest.Mock).mockResolvedValue({ error: 'API error' })

      const result = await Messages.fetch('msg1')

      expect(API.get).toHaveBeenCalledWith('msg1')
      expect(result).toEqual([])
    })
  })

  describe('getById', () => {
    it('should return a message by ID', async () => {
      ;(Storage.get as jest.Mock).mockResolvedValue(mockMessages)

      const result = await Messages.getById('msg1')

      expect(result?.id).toBe('msg1')
    })

    it('should return undefined if message ID is not found', async () => {
      ;(Storage.get as jest.Mock).mockResolvedValue(mockMessages)

      const result = await Messages.getById('msg3') // Non-existent ID

      expect(result).toBeUndefined()
    })
  })

  describe('getUnreadCount', () => {
    it('should return the number of unread messages', async () => {
      ;(Storage.get as jest.Mock).mockResolvedValue(mockMessages)

      const result = await Messages.getUnreadCount()

      expect(result).toBe(1) // Only one unread message in mockMessages
    })
  })

  describe('update', () => {
    it('should update a message and return updated message', async () => {
      ;(Storage.get as jest.Mock).mockResolvedValue(mockMessages)
      ;(Storage.set as jest.Mock).mockResolvedValue(undefined)

      const result = await Messages.update('msg1', { read: true })
      const expected = [{ ...mockMessages[0], read: true }, mockMessages[1]]

      expect(Storage.get).toHaveBeenCalledWith(STORAGE_KEY)
      expect(Storage.set).toHaveBeenCalledWith(STORAGE_KEY, expect.any(Array))
      expect(result).toStrictEqual(expected)
    })

    it('should return empty array if an error occurs during update', async () => {
      ;(Storage.get as jest.Mock).mockRejectedValue(new Error('Storage error'))

      const result = await Messages.update('msg1', { read: true })

      expect(Storage.get).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result).toStrictEqual([])
    })
  })
})
