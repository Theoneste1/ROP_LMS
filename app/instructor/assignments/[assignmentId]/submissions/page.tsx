import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SubmissionList } from "@/components/instructor/submission-list"

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>
}) {
  const { assignmentId } = await params
  const session = await auth()

  // Authentication optional

  // Role check disabled

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      course: true,
      submissions: {
        include: {
          user: true,
        },
        orderBy: {
          submittedAt: "desc",
        },
      },
    },
  })

  if (!assignment) {
    redirect("/instructor/dashboard")
  }

  // Verify ownership
  // Role check disabled - allow all access

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/instructor/courses/${assignment.courseId}/edit`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-600 mt-2">
            Grade submissions from {assignment.submissions.length} student(s)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Review and grade student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionList assignment={assignment} submissions={assignment.submissions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
