import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText, Download, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { AssignmentSubmissionForm } from "@/components/courses/assignment-submission-form"
import { prisma } from "@/lib/prisma"
import { dummyAssignment, dummyCourse, dummyCourses, dummyAssignments } from "@/lib/dummy-data"

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ slug: string; assignmentId: string }>
}) {
  const { slug, assignmentId } = await params
  const session = await auth()

  // Authentication optional

  // Try to fetch from database, fallback to dummy data
  let assignment = null
  try {
    assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
        instructor: true,
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    // Try to find assignment in dummy data
    const course = dummyCourses.find(c => c.slug === slug)
    assignment = course?.assignments?.find((a: any) => a.id === assignmentId) ||
      dummyAssignments.find(a => a.id === assignmentId) || 
      (assignmentId === dummyAssignment.id ? dummyAssignment : null)
  }

  // Allow navigation - show error message if assignment not found instead of redirecting
  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href={`/courses/${slug}/learn`}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground">Assignment not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check enrollment
  let enrollment = null
  if (assignment && session?.user?.id) {
    try {
      const courseId = 'courseId' in assignment ? assignment.courseId : ('course' in assignment && assignment.course ? assignment.course.id : null)
      if (courseId) {
        enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: courseId,
            },
          },
        })
      }
    } catch (error) {
      console.warn('Could not check enrollment:', error)
    }
  }

  // Allow guest access - no redirect needed

  // Get existing submission
  let submission = null
  if (assignment && session?.user?.id) {
    try {
      submission = await prisma.submission.findUnique({
        where: {
          assignmentId_userId: {
            assignmentId: assignmentId,
            userId: session.user.id,
          },
        },
      })
    } catch (error) {
      console.warn('Could not get submission:', error)
      // Use dummy submission for testing
      if (assignmentId === "assignment-1") {
        submission = {
          id: "submission-1",
          assignmentId: assignmentId,
          userId: session.user.id,
          content: "This is a sample submission for testing.",
          fileUrl: null,
          status: "GRADED" as const,
          score: 85,
          feedback: "Great work! Your solution demonstrates a solid understanding of the concepts. Keep up the excellent work!",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/courses/${slug}/learn`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{assignment.title}</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.description && (
              <div>
                <p className="text-sm font-medium mb-2">Description:</p>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: assignment.description }}
                />
              </div>
            )}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Max Score: {assignment.maxScore} points</span>
              </div>
              {assignment.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {submission ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  {submission.status === "GRADED" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Graded</span>
                    </>
                  ) : submission.status === "SUBMITTED" ? (
                    <>
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Submitted</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600 font-medium">Pending</span>
                    </>
                  )}
                </span>
                {submission.score !== null && (
                  <span className="font-semibold text-lg">
                    Score: {submission.score}/{assignment.maxScore} points
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-sm font-medium mb-2">Your Answer:</p>
                <div 
                  className="p-4 bg-muted rounded-lg"
                  dangerouslySetInnerHTML={{ __html: submission.content }} 
                />
              </div>

              {submission.fileUrl && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Uploaded File:</p>
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View/Download File</span>
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              )}

              {submission.status === "GRADED" && (
                <div className="space-y-3">
                  {submission.score !== null && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-green-900">Grade</p>
                        <p className="text-lg font-bold text-green-700">
                          {submission.score}/{assignment.maxScore}
                        </p>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(submission.score / assignment.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {submission.feedback && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Instructor Comments:
                      </p>
                      <div 
                        className="text-sm text-blue-800 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: submission.feedback }} 
                      />
                    </div>
                  )}

                  {submission.gradedAt && (
                    <p className="text-xs text-muted-foreground">
                      Graded on: {format(new Date(submission.gradedAt), "PPP 'at' p")}
                    </p>
                  )}
                </div>
              )}

              {submission.status === "SUBMITTED" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your submission is being reviewed by the instructor.
                  </p>
                </div>
              )}

              {submission.status === "PENDING" && (
                <div className="mt-4">
                  <AssignmentSubmissionForm
                    assignmentId={assignmentId}
                    courseSlug={slug}
                    initialContent={submission.content}
                    initialFileUrl={submission.fileUrl}
                    isUpdate={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Submit Assignment</CardTitle>
              <CardDescription>
                Submit your assignment below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentSubmissionForm
                assignmentId={assignmentId}
                courseSlug={slug}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
