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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Lesson } from "@/types/prisma"

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: z.enum(["VIDEO", "TEXT", "QUIZ", "ASSIGNMENT"]),
  order: z.number().int().min(1),
})

type LessonFormData = z.infer<typeof lessonSchema>

export function EditLessonForm({
  lesson,
  courseId,
}: {
  lesson: Lesson
  courseId: string
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
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      type: lesson.type as "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT",
      order: lesson.order,
    },
  })

  const type = watch("type")

  const onSubmit = async (data: LessonFormData) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          videoUrl: data.videoUrl || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update lesson")
      }

      toast({
        title: "Success!",
        description: "Lesson updated successfully.",
      })

      router.push(`/instructor/courses/${courseId}/edit`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update lesson",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Information</CardTitle>
        <CardDescription>
          Update the lesson details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Introduction to Algebra"
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
              placeholder="Brief description of what students will learn..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Lesson Type *</Label>
              <Select
                value={type}
                onValueChange={(value: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT") =>
                  setValue("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text Lesson</SelectItem>
                  <SelectItem value="VIDEO">Video Lesson</SelectItem>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                  <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order *</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
                min={1}
              />
              {errors.order && (
                <p className="text-sm text-destructive">{errors.order.message}</p>
              )}
            </div>
          </div>

          {type === "VIDEO" && (
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                {...register("videoUrl")}
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-sm text-muted-foreground">
                For YouTube videos, use the embed URL format
              </p>
              {errors.videoUrl && (
                <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
              )}
            </div>
          )}

          {(type === "TEXT" || type === "ASSIGNMENT") && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Enter lesson content (HTML/Markdown supported)..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                You can use HTML or Markdown formatting
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Changes"}
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
