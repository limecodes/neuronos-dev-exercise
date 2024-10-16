import Messages from '../lib/Messages'
import type { Message } from '../types'

export async function handleUpdateBadge(messages: Message[]) {
  const unreadCount = await Messages.getUnreadCount(messages)
  const text = unreadCount ? unreadCount.toString() : ''
  chrome.action.setBadgeText({ text })
}
