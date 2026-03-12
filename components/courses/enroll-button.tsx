"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function EnrollButton({
  courseId,
  courseSlug,
}: {
  courseId: string
  courseSlug: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error === "Already enrolled") {
          router.push(`/courses/${courseSlug}/learn`)
          return
        }
        throw new Error(data.error || "Failed to enroll")
      }

      toast({
        title: "Success!",
        description: "You have been enrolled in this course.",
      })

      router.push(`/courses/${courseSlug}/learn`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enroll",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleEnroll} className="w-full" disabled={loading}>
      {loading ? "Enrolling..." : "Enroll Now"}
    </Button>
  )
}
