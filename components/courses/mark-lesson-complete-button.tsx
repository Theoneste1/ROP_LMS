"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MarkLessonCompleteButton({
  lessonId,
  enrollmentId,
  courseSlug,
  isCompleted,
}: {
  lessonId: string
  enrollmentId: string
  courseSlug: string
  isCompleted: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enrollmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to mark lesson as complete")
      }

      toast({
        title: "Success!",
        description: "Lesson marked as complete.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (isCompleted) {
    return null
  }

  return (
    <Button onClick={handleComplete} disabled={loading}>
      <CheckCircle2 className="h-4 w-4 mr-2" />
      {loading ? "Marking..." : "Mark as Complete"}
    </Button>
  )
}
