import { handleNewMessages } from '../handlers'

export async function onAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name === 'checkMessages') {
    handleNewMessages(messages => {
      chrome.runtime.sendMessage(
        { action: 'NEW_MESSAGES', messages },
        response => {
          if (chrome.runtime.lastError) {
            console.error(
              'Error: No receiving end for the message. The listener might not be registered yet.',
            )
          } else {
            console.log('Message sent successfully:', response)
          }
        },
      )

      if (messages.length > 20) {
        chrome.alarms.clear(alarm.name, wasCleared => {
          if (wasCleared) {
            console.log('Alarm cleared because message count exceeded 20')
          } else {
            console.error('Failed to clear the alarm')
            chrome.runtime.sendMessage({
              action: 'ERROR',
              messages: [],
              error: 'Failed to clear the alarm',
            })
          }
        })
      }
    })
  }
}
