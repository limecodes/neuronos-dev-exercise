export type Priority = 'high' | 'low'

export type Message = {
  id: string
  content: string
  priority: Priority
  timestamp: string
  read: boolean
}

export type MessageResponse = {
  messages: Message[]
  pageInfo: {
    start: string | null
  }
}

export type EventAction = 'NEW_MESSAGES' | 'UPDATE_MESSAGE'

export type EventMessage = {
  action: EventAction
  id: string
  message: Partial<Message>
}
