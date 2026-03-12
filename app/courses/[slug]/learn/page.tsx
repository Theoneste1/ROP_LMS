import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { dummyCourse, dummyCourses } from "@/lib/dummy-data"

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  // Authentication optional

  // Try to fetch from database, fallback to dummy data
  let course = null
  try {
    course = await prisma.course.findUnique({
      where: {
        slug: slug,
      },
      include: {
        lessons: {
          orderBy: [
            { topic: "asc" },
            { order: "asc" },
          ],
          include: {
            quiz: {
              include: {
                questions: {
                  orderBy: {
                    order: "asc",
                  },
                },
              },
            },
          },
        },
        assignments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    course = dummyCourses.find(c => c.slug === slug) || 
      (slug === dummyCourse.slug ? dummyCourse : null) as any
  }

  // Allow navigation - show error message if course not found instead of redirecting
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground">Course not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check enrollment
  let enrollment = null
  let completedLessonIds: string[] = []
  
  if (course && session?.user?.id) {
    try {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
        include: {
          progress: {
            where: {
              userId: session.user.id,
            },
          },
        },
      })

      if (enrollment) {
        completedLessonIds = enrollment.progress
          .filter((p: { completed: boolean }) => p.completed)
          .map((p: { lessonId: string }) => p.lessonId)
      }
    } catch (error) {
      console.warn('Could not check enrollment:', error)
    }
  }

  // Find first incomplete lesson (or first lesson if not enrolled)
  const firstIncompleteLesson = enrollment 
    ? course.lessons.find((lesson: { id: string }) => !completedLessonIds.includes(lesson.id))
    : course.lessons[0]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/courses/${slug}`}>
            <Button variant="ghost" className="mb-4">
              ← Back to Course
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>
              Complete lessons in order to unlock the next ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {course.lessons.map((lesson: { id: string; title: string; type: string; description?: string | null }, index: number) => {
                const isCompleted = enrollment ? completedLessonIds.includes(lesson.id) : false
                // Allow access to all lessons when not logged in, or follow enrollment rules when logged in
                const isLocked = enrollment && index > 0 && !completedLessonIds.includes(course.lessons[index - 1].id)
                const canAccess = !isLocked

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      isCompleted ? "bg-green-50 border-green-200" : ""
                    } ${isLocked ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-[#0891B2]" />
                      )}
                      <div>
                        <p className="font-medium">
                          {index + 1}. {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {canAccess ? (
                      <Link href={`/courses/${slug}/lessons/${lesson.id}`}>
                        <Button variant={isCompleted ? "outline" : "default"} size="sm">
                          {isCompleted ? "Review" : "Start"}
                        </Button>
                      </Link>
                    ) : (
                      <Badge variant="secondary">Locked</Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {firstIncompleteLesson && (
          <div className="mt-6">
            <Link href={`/courses/${slug}/lessons/${firstIncompleteLesson.id}`}>
              <Button size="lg" className="w-full">
                Continue with: {firstIncompleteLesson.title}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
