"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"

const questionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().int().min(1).default(1),
  order: z.number().int().min(1),
})

type QuestionFormData = z.infer<typeof questionSchema>

export function CreateQuestionForm({
  quizId,
  defaultOrder,
}: {
  quizId: string
  defaultOrder: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: "multiple_choice",
      points: 1,
      order: defaultOrder,
      options: ["", "", "", ""],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore - Type inference issue with optional fields
    name: "options",
  })

  const type = watch("type")

  const onSubmit = async (data: QuestionFormData) => {
    setLoading(true)
    try {
      // For multiple choice, validate options
      if (data.type === "multiple_choice") {
        const validOptions = data.options?.filter((opt) => opt.trim() !== "") || []
        if (validOptions.length < 2) {
          toast({
            title: "Error",
            description: "Multiple choice questions need at least 2 options",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
        if (!validOptions.includes(data.correctAnswer)) {
          toast({
            title: "Error",
            description: "Correct answer must be one of the options",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      const response = await fetch(`/api/instructor/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          quizId,
          options:
            data.type === "multiple_choice"
              ? JSON.stringify(data.options?.filter((opt) => opt.trim() !== ""))
              : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create question")
      }

      toast({
        title: "Success!",
        description: "Question created successfully.",
      })

      router.push(`/instructor/quizzes/${quizId}/questions`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create question",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Information</CardTitle>
        <CardDescription>
          Add a question to your quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              {...register("question")}
              placeholder="Enter your question here..."
              rows={3}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type *</Label>
              <Select
                value={type}
                onValueChange={(value: "multiple_choice" | "true_false" | "short_answer") =>
                  setValue("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points *</Label>
              <Input
                id="points"
                type="number"
                {...register("points", { valueAsNumber: true })}
                min={1}
              />
              {errors.points && (
                <p className="text-sm text-destructive">{errors.points.message}</p>
              )}
            </div>
          </div>

          {type === "multiple_choice" && (
            <div className="space-y-2">
              <Label>Options *</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`options.${index}` as const)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          )}

          {type === "true_false" && (
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer *</Label>
              <Select
                value={watch("correctAnswer")}
                onValueChange={(value) => setValue("correctAnswer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">True</SelectItem>
                  <SelectItem value="False">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "short_answer" && (
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer *</Label>
              <Input
                id="correctAnswer"
                {...register("correctAnswer")}
                placeholder="Enter the correct answer"
              />
              {errors.correctAnswer && (
                <p className="text-sm text-destructive">
                  {errors.correctAnswer.message}
                </p>
              )}
            </div>
          )}

          {type === "multiple_choice" && (
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer *</Label>
              <Select
                value={watch("correctAnswer")}
                onValueChange={(value) => setValue("correctAnswer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {watch("options")
                    ?.filter((opt) => opt.trim() !== "")
                    .map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.correctAnswer && (
                <p className="text-sm text-destructive">
                  {errors.correctAnswer.message}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Question"}
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
