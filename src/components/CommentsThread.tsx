import { Bot, MessageSquare, Shield, User } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import type { Comment } from '@/types'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Textarea } from './ui/textarea'

interface CommentsThreadProps {
  comments: Comment[]
  onSend?: (body: string) => void
  className?: string
}

function authorIcon(type: Comment['authorType']) {
  switch (type) {
    case 'admin':
      return <Shield className="h-4 w-4 text-primary" />
    case 'system':
      return <Bot className="h-4 w-4 text-muted-foreground" />
    default:
      return <User className="h-4 w-4 text-muted-foreground" />
  }
}

function authorLabel(c: Comment) {
  if (c.authorType === 'system') return 'System'
  if (c.authorType === 'admin') return c.authorEmail ?? 'Admin'
  return c.authorEmail ?? 'You'
}

export function CommentsThread({
  comments,
  onSend,
  className,
}: CommentsThreadProps) {
  const [body, setBody] = useState('')
  const handleSend = () => {
    if (body.trim() && onSend) {
      onSend(body.trim())
      setBody('')
    }
  }
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="border-b border-border bg-muted/30 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MessageSquare className="h-4 w-4" />
          Comments & activity
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto divide-y divide-border">
          {comments.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No comments yet.
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  {authorIcon(c.authorType)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {authorLabel(c)}
                    </span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">{c.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {onSend && (
          <div className="border-t border-border p-3">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[80px] resize-none"
              id="comment-input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button
              className="mt-2"
              onClick={handleSend}
              disabled={!body.trim()}
            >
              Send
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
