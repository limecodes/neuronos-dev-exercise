import { handleNewMessages } from '../handlers'

export async function onAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name === 'checkMessages') {
    handleNewMessages(messages => {
      chrome.runtime.sendMessage({
        action: 'NEW_MESSAGES',
        messages: messages,
      })
    })
  }
}
