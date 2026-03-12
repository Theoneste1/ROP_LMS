"use client"

import { Question } from "@/types/prisma"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, GripVertical } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function QuestionList({
  quizId,
  questions,
}: {
  quizId: string
  questions: Question[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (questionId: string) => {
    setDeletingId(questionId)
    try {
      const response = await fetch(`/api/instructor/questions/${questionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete question")
      }

      toast({
        title: "Success!",
        description: "Question deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No questions yet. Add your first question to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        let options: string[] = []
        try {
          options = question.options ? JSON.parse(question.options) : []
        } catch (e) {
          // Invalid JSON, ignore
        }

        return (
          <div
            key={question.id}
            className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-start gap-3 flex-1">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Question {index + 1}</span>
                  <span className="text-sm text-muted-foreground">
                    ({question.points} point{question.points !== 1 ? "s" : ""})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Type: {question.type}
                  </span>
                </div>
                <p className="font-medium mb-2">{question.question}</p>
                {options.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {options.map((option, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {String.fromCharCode(65 + i)}. {option}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-sm text-green-600 mt-2">
                  Correct Answer: {question.correctAnswer}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/instructor/quizzes/${quizId}/questions/${question.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === question.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this question. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(question.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )
      })}
    </div>
  )
}
