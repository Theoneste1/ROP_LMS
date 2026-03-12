"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Quiz, Question, QuizAttempt } from "@/types/prisma"
import { Clock } from "lucide-react"

const answerSchema = z.object({
  answers: z.record(z.string()).optional().default({}),
})

type AnswerFormData = z.infer<typeof answerSchema>

export function QuizAttemptForm({
  quiz,
  courseSlug,
  lessonId,
  existingAttempt,
}: {
  quiz: Quiz & { questions: Question[] }
  courseSlug: string
  lessonId: string
  existingAttempt: QuizAttempt | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  )

  const form = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answers: {},
    },
  })
  const { register, handleSubmit, watch, setValue } = form

  const onSubmit = useCallback(async (data: AnswerFormData) => {
    setLoading(true)
    try {
      const attemptId = existingAttempt?.id

      // Extract answers from form data
      const answers = data.answers || {}

      const response = await fetch(
        attemptId
          ? `/api/quizzes/${quiz.id}/attempts/${attemptId}/submit`
          : `/api/quizzes/${quiz.id}/attempts`,
        {
          method: attemptId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: answers,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quiz")
      }

      toast({
        title: "Success!",
        description: "Quiz submitted successfully.",
      })

      router.push(
        `/courses/${courseSlug}/lessons/${lessonId}/quiz/results/${result.attempt.id}`
      )
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quiz",
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [existingAttempt?.id, quiz.id, courseSlug, lessonId, router, toast])

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit(onSubmit)()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, handleSubmit, onSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {timeRemaining !== null && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">
                Time Remaining: {formatTime(timeRemaining)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {quiz.questions.map((question: Question, index: number) => {
        let options: string[] = []
        try {
          options = question.options ? JSON.parse(question.options) : []
        } catch (e) {
          // Invalid JSON
        }

        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {index + 1} ({question.points} point{question.points !== 1 ? "s" : ""})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{question.question}</p>

              {question.type === "multiple_choice" && options.length > 0 && (
                <RadioGroup
                  value={watch(`answers.${question.id}`)}
                  onValueChange={(value) => setValue(`answers.${question.id}` as any, value)}
                >
                  {options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                      <Label htmlFor={`${question.id}-${i}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "true_false" && (
                <RadioGroup
                  value={watch(`answers.${question.id}`)}
                  onValueChange={(value) => setValue(`answers.${question.id}` as any, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="True" id={`${question.id}-true`} />
                    <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="False" id={`${question.id}-false`} />
                    <Label htmlFor={`${question.id}-false`} className="cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {question.type === "short_answer" && (
                <Input
                  {...register(`answers.${question.id}`)}
                  placeholder="Enter your answer"
                />
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1" size="lg">
          {loading ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </form>
  )
}
