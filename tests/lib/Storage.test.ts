import Storage from '../../src/lib/Storage'

describe('Storage module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    chrome.runtime.lastError = undefined
  })

  describe('get', () => {
    it('should return the stored data when available', async () => {
      const mockData = { myKey: 'testValue' }

      // Cast the function to jest.Mock to use mockImplementation
      ;(chrome.storage.local.get as jest.Mock).mockImplementation(
        (_, callback) => {
          callback(mockData)
        },
      )

      const result = await Storage.get<string>('myKey')

      expect(chrome.storage.local.get).toHaveBeenCalledWith(
        'myKey',
        expect.any(Function),
      )
      expect(result).toBe('testValue')
    })

    it('should reject with "No data found" if the key does not exist', async () => {
      ;(chrome.storage.local.get as jest.Mock).mockImplementation(
        (_, callback) => {
          callback({})
        },
      )

      await expect(Storage.get('myKey')).rejects.toThrow('No data found')
      expect(chrome.storage.local.get).toHaveBeenCalledWith(
        'myKey',
        expect.any(Function),
      )
    })

    it('should reject with lastError if chrome.runtime.lastError exists', async () => {
      chrome.runtime.lastError = new Error('Storage error')

      await expect(Storage.get('myKey')).rejects.toThrow('Storage error')
      expect(chrome.storage.local.get).toHaveBeenCalledWith(
        'myKey',
        expect.any(Function),
      )
    })
  })

  describe('set', () => {
    it('should resolve after storing data', async () => {
      ;(chrome.storage.local.set as jest.Mock).mockImplementation(
        (_, callback) => {
          callback()
        },
      )

      await expect(Storage.set('myKey', 'testValue')).resolves.toBeUndefined()

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        { myKey: 'testValue' },
        expect.any(Function),
      )
    })

    it('should reject with lastError if chrome.runtime.lastError exists during set', async () => {
      chrome.runtime.lastError = new Error('Storage error')

      await expect(Storage.set('myKey', 'testValue')).rejects.toThrow(
        'Storage error',
      )
      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        { myKey: 'testValue' },
        expect.any(Function),
      )
    })
  })
})
