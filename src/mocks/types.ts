export type CreateRandomMessageOptions = {
  lastMessageId: string | null
  lastMessageTimestamp: Date
}

export type CreateMockedResponseOptions = {
  max: number
  lastMessageId: string | null
  lastMessageTimestamp: string | null
}
