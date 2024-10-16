import { handleNewMessages } from '../handlers'

export async function onInstalled() {
  chrome.alarms.create('checkMessages', { periodInMinutes: 1 })
  handleNewMessages()
}
