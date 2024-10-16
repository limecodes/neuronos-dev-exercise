export type ResponseType<T> = Record<string, T> & {
  pageInfo: { cursor: string | null; limit: number }
}

export type Variables = {
  cursor: string | null
  timestamp?: string
  limit?: number
}

export type ErrorType = {
  error: string
}
