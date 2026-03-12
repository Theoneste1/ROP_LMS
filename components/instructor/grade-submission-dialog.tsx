"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Submission } from "@/types/prisma"

const gradeSchema = z.object({
  score: z.number().int().min(0),
  feedback: z.string().optional(),
})

type GradeFormData = z.infer<typeof gradeSchema>

export function GradeSubmissionDialog({
  submission,
  maxScore,
}: {
  submission: Submission
  maxScore: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      score: submission.score ?? 0,
      feedback: submission.feedback || "",
    },
  })

  const onSubmit = async (data: GradeFormData) => {
    if (data.score > maxScore) {
      toast({
        title: "Error",
        description: `Score cannot exceed ${maxScore}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/submissions/${submission.id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to grade submission")
      }

      toast({
        title: "Success!",
        description: "Submission graded successfully.",
      })

      setOpen(false)
      reset()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to grade submission",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={submission.status === "GRADED" ? "outline" : "default"}>
          {submission.status === "GRADED" ? "Update Grade" : "Grade Submission"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Provide a score and feedback for this submission
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score">Score *</Label>
            <Input
              id="score"
              type="number"
              {...register("score", { valueAsNumber: true })}
              min={0}
              max={maxScore}
            />
            <p className="text-sm text-muted-foreground">
              Maximum score: {maxScore} points
            </p>
            {errors.score && (
              <p className="text-sm text-destructive">{errors.score.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              {...register("feedback")}
              placeholder="Provide feedback to the student..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Grading..." : "Submit Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
