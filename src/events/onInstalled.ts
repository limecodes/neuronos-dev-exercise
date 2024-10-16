import { handleNewMessages } from '../handlers'

export async function onInstalled() {
  console.log('Background script installed')

  chrome.alarms.create('checkMessages', { periodInMinutes: 1 })
  handleNewMessages()
}
