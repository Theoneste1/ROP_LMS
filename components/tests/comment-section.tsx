"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Reply, Send, MoreVertical } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  userId: string
  user: {
    name: string | null
    email: string
    image: string | null
  }
  parentId: string | null
  likes: number
  dislikes: number
  createdAt: Date
  replies?: Comment[]
  reactions?: Array<{
    userId: string
    type: string
  }>
}

interface CommentSectionProps {
  testId: string
}

export function CommentSection({ testId }: CommentSectionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    fetchComments()
  }, [testId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/comments`)
      const data = await response.json()
      
      if (response.ok) {
        // Ensure we have an array and handle nested replies
        const commentsList = Array.isArray(data.comments) ? data.comments : []
        setComments(commentsList)
      } else {
        console.error("Failed to fetch comments:", data.error)
        setComments([])
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/tests/${testId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      const result = await response.json()

      if (response.ok) {
        setNewComment("")
        // Refresh comments immediately
        await fetchComments()
        toast({
          title: "Success",
          description: "Comment posted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to post comment")
      }
    } catch (error) {
      console.error("Post comment error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive",
      })
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch(`/api/tests/${testId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentId }),
      })

      const result = await response.json()

      if (response.ok) {
        setReplyContent("")
        setReplyingTo(null)
        // Refresh comments immediately
        await fetchComments()
        toast({
          title: "Success",
          description: "Reply posted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to post reply")
      }
    } catch (error) {
      console.error("Post reply error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
      })
    }
  }

  const handleReaction = async (commentId: string, type: "like" | "dislike") => {
    if (!session?.user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to like/dislike comments",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/tests/${testId}/comments/${commentId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        fetchComments()
      } else {
        throw new Error("Failed to react to comment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to react to comment",
        variant: "destructive",
      })
    }
  }

  const renderComment = (comment: Comment, isReply = false) => {
    const userReaction = comment.reactions?.find((r) => r.userId === session?.user?.id)
    const isLiked = userReaction?.type === "like"
    const isDisliked = userReaction?.type === "dislike"

    return (
      <div key={comment.id} className={isReply ? "ml-8 mt-4 border-l-2 border-gray-200 pl-4" : ""}>
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name || ""} />
                <AvatarFallback className="bg-[#0891B2] text-white text-xs">
                  {comment.user.name?.charAt(0).toUpperCase() || comment.user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {comment.user.name || comment.user.email.split("@")[0]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 text-xs ${isLiked ? "text-[#0891B2]" : ""}`}
                    onClick={() => handleReaction(comment.id, "like")}
                  >
                    <ThumbsUp className={`h-3 w-3 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {comment.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 text-xs ${isDisliked ? "text-red-500" : ""}`}
                    onClick={() => handleReaction(comment.id, "dislike")}
                  >
                    <ThumbsDown className={`h-3 w-3 mr-1 ${isDisliked ? "fill-current" : ""}`} />
                    {comment.dislikes}
                  </Button>
                  {!isReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
                {replyingTo === comment.id && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(comment.id)}
                        className="text-xs"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Post Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent("")
                        }}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8 text-sm text-gray-500">Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="space-y-2 mb-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm"
            rows={3}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="text-sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments
            .filter((c) => !c.parentId)
            .map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}
