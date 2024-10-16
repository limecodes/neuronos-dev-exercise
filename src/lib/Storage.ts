import { StorageArg } from './types'

/**
 * Get data from storage
 * @param storageKey
 * @returns Promise<ReturnType>
 * @throws Error if no data found
 */
function get<ReturnType>(storageKey: string): Promise<ReturnType> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get<StorageArg<ReturnType>>(storageKey, data => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }

      const storedData = data[storageKey]

      if (storedData === undefined) {
        return reject(new Error('No data found'))
      }

      resolve(storedData)
    })
  })
}

/**
 * Set data to storage
 * @param storageKey
 * @param payload
 * @returns Promise<void>
 * @throws Error if storage fails
 */
function set<InputType>(storageKey: string, payload: InputType): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set<StorageArg<InputType>>(
      { [storageKey]: payload },
      () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError)
        }

        resolve()
      },
    )
  })
}

export default {
  get,
  set,
}
