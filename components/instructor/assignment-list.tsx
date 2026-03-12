"use client"

import { Assignment } from "@/types/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Users } from "lucide-react"
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
import { format } from "date-fns"

export function AssignmentList({
  courseId,
  assignments,
}: {
  courseId: string
  assignments: Assignment[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (assignmentId: string) => {
    setDeletingId(assignmentId)
    try {
      const response = await fetch(`/api/instructor/assignments/${assignmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete assignment")
      }

      toast({
        title: "Success!",
        description: "Assignment deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No assignments yet. Add your first assignment to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center gap-3 flex-1">
            <div>
              <p className="font-medium">{assignment.title}</p>
              {assignment.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {assignment.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>Max Score: {assignment.maxScore}</span>
                {assignment.dueDate && (
                  <span>Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/instructor/assignments/${assignment.id}/submissions`}>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deletingId === assignment.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the assignment "{assignment.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(assignment.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}
