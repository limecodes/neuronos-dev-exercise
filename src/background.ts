import Events from './events'

chrome.alarms.onAlarm.addListener(Events.onAlarm)
chrome.runtime.onInstalled.addListener(Events.onInstalled)
chrome.runtime.onMessage.addListener(Events.onMessage)
