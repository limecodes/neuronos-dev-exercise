import Messages from '../lib/Messages'
import type { Message } from '../types'

/**
 * Updates the badge text with the unread count
 * @param messages
 * @returns void
 */
export async function handleUpdateBadge(messages: Message[]) {
  const unreadCount = await Messages.getUnreadCount(messages)
  const text = unreadCount ? unreadCount.toString() : ''
  chrome.action.setBadgeText({ text })
}
