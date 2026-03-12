"use client"

import { Assignment, Submission, User } from "@/types/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { GradeSubmissionDialog } from "@/components/instructor/grade-submission-dialog"

type SubmissionWithUser = Submission & {
  user: User
}

export function SubmissionList({
  assignment,
  submissions,
}: {
  assignment: Assignment
  submissions: SubmissionWithUser[]
}) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No submissions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {submission.user.name || submission.user.email}
                </CardTitle>
                <CardDescription>
                  Submitted: {submission.submittedAt ? format(new Date(submission.submittedAt), "PPP") : "Not submitted"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    submission.status === "GRADED"
                      ? "default"
                      : submission.status === "SUBMITTED"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {submission.status}
                </Badge>
                {submission.score !== null && (
                  <span className="text-sm font-medium">
                    {submission.score}/{assignment.maxScore}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-4">
              <div dangerouslySetInnerHTML={{ __html: submission.content }} />
            </div>
            {submission.feedback && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Your Feedback:</p>
                <p className="text-sm">{submission.feedback}</p>
              </div>
            )}
            <div className="mt-4">
              <GradeSubmissionDialog
                submission={submission}
                maxScore={assignment.maxScore}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
