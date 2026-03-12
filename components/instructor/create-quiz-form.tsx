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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  timeLimit: z.number().int().min(1).optional().or(z.literal("")),
  passingScore: z.number().int().min(0).max(100).default(70),
})

type QuizFormData = z.infer<typeof quizSchema>

export function CreateQuizForm({ lessonId }: { lessonId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      passingScore: 70,
    },
  })

  const onSubmit = async (data: QuizFormData) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          lessonId,
          timeLimit: data.timeLimit || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create quiz")
      }

      toast({
        title: "Success!",
        description: "Quiz created successfully. Now add questions.",
      })

      router.push(`/instructor/quizzes/${result.quiz.id}/questions`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create quiz",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
        <CardDescription>
          Create a quiz for this lesson
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Chapter 1 Quiz"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the quiz..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                {...register("timeLimit", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                placeholder="Optional"
                min={1}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty for no time limit
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%) *</Label>
              <Input
                id="passingScore"
                type="number"
                {...register("passingScore", { valueAsNumber: true })}
                min={0}
                max={100}
              />
              {errors.passingScore && (
                <p className="text-sm text-destructive">
                  {errors.passingScore.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Quiz & Add Questions"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
