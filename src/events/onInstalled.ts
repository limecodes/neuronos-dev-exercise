import { handleNewMessages } from '../handlers'

export async function onInstalled() {
  chrome.alarms.get('checkMessages', alarm => {
    if (!alarm) {
      chrome.alarms.create('checkMessages', { periodInMinutes: 1 })
    }
  })
  handleNewMessages()
}
