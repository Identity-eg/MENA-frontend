/** Sender shape included with message from API */
export type TMessageSender = {
  id: number
  name: string
  email: string
  role: string
}

/** Message on a request (from GET/POST /api/requests/:id/messages) */
export type TMessage = {
  id: number
  requestId: number
  senderId: number
  content: string
  isRead: boolean
  createdAt: string
  sender: TMessageSender
}
