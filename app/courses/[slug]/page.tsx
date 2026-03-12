import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Clock, CheckCircle2, PlayCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { EnrollButton } from "@/components/courses/enroll-button"
import { prisma } from "@/lib/prisma"
import { dummyCourse, dummyCourses } from "@/lib/dummy-data"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  
  // Try to fetch from database, fallback to dummy data
  let course = null
  try {
    course = await prisma.course.findUnique({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
      include: {
        instructor: true,
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
        _count: {
          select: {
            enrollments: true,
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

  // Check if user is enrolled
  let enrollment = null
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
    } catch (error) {
      console.warn('Could not check enrollment:', error)
    }
  }

  // Get progress for enrolled users
  const completedLessonIds = enrollment?.progress
    .filter((p: { completed: boolean }) => p.completed)
    .map((p: { lessonId: string }) => p.lessonId) || []


  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 text-sm md:text-base">{course.description}</p>
            </div>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>{course.lessons.length} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{course._count.enrollments} Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Instructor:</span>
                    <span>{course.instructor.name || course.instructor.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.lessons.length} lessons in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lesson: { id: string; title: string; type: string; description?: string | null }, index: number) => {
                    const isCompleted = completedLessonIds.includes(lesson.id)
                    // Allow guest access - all lessons accessible for frontend testing
                    // Sequential unlocking only applies when enrolled
                    const canAccess = !enrollment || (
                      index === 0 || 
                      (index > 0 && completedLessonIds.includes(course.lessons[index - 1].id))
                    )

                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          isCompleted ? "bg-green-50 border-green-200" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-muted-foreground" />
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
                            <Button variant="outline" size="sm">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Enroll in Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollment ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You are enrolled in this course
                    </p>
                    <Link href={`/courses/${slug}/learn`}>
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Start learning today! Enroll to access all course content.
                    </p>
                    {session ? (
                      <EnrollButton courseId={course.id} courseSlug={slug} />
                    ) : (
                      <Link href={`/auth/signin?callbackUrl=/courses/${slug}`}>
                        <Button className="w-full">Sign In to Enroll</Button>
                      </Link>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
