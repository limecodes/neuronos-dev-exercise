import { StorageArg } from './types'

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
