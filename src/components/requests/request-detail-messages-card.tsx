import { memo, useEffect, useRef } from 'react'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatMessageTime } from './request-detail-formatters'
import type { TMessage } from '@/types/message'

type RequestDetailMessagesCardProps = {
  requestUserId: number
  messages: TMessage[]
  messagesLoading: boolean
  messageDraft: string
  onMessageDraftChange: (value: string) => void
  isSendPending: boolean
  onSubmitMessage: () => void
}

export const RequestDetailMessagesCard = memo(function RequestDetailMessagesCard({
  requestUserId,
  messages,
  messagesLoading,
  messageDraft,
  onMessageDraftChange,
  isSendPending,
  onSubmitMessage,
}: RequestDetailMessagesCardProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Messages
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Questions about this request? Reply here.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 pt-0">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 max-h-70 min-h-30 overflow-y-auto rounded-xl border bg-muted/20 p-3">
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    No messages yet
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn =
                    Number(msg.senderId) === Number(requestUserId)
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col gap-0.5 max-w-[85%]',
                        isOwn
                          ? 'self-end items-end'
                          : 'self-start items-start',
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-xl px-3 py-2 text-sm',
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border',
                        )}
                      >
                        {!isOwn && (
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {msg.sender.name}
                            {msg.sender.role === 'ADMIN' && (
                              <span className="ml-1.5 text-primary">
                                · Support
                              </span>
                            )}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap wrap-break-word">
                          {msg.content}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'text-[10px] text-muted-foreground',
                          isOwn ? 'mr-1' : 'ml-1',
                        )}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                onSubmitMessage()
              }}
            >
              <Input
                placeholder="Type a message…"
                className="h-9 flex-1 text-sm"
                value={messageDraft}
                onChange={(e) => onMessageDraftChange(e.target.value)}
                disabled={isSendPending}
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 shrink-0 px-3"
                disabled={
                  !messageDraft.trim() || isSendPending
                }
              >
                {isSendPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" aria-hidden />
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
})
