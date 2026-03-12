import { auth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { MarkLessonCompleteButton } from "@/components/courses/mark-lesson-complete-button"
import { prisma } from "@/lib/prisma"
import { dummyCourse, dummyCourses, dummyLesson } from "@/lib/dummy-data"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const session = await auth()
  // Authentication optional - allow access without login

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
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    course = dummyCourses.find(c => c.slug === slug) || 
      (slug === dummyCourse.slug ? dummyCourse : null) as any
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground">Course not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Try to fetch lesson from database
  let lesson = null
  try {
    lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
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
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    lesson = course.lessons.find((l: any) => l.id === lessonId) || 
      (lessonId === dummyLesson.id ? dummyLesson : null)
    
    // If lesson from course array doesn't have full content, use dummyLesson
    if (lesson && !lesson.content && lessonId === dummyLesson.id) {
      lesson = dummyLesson
    }
    
    // Add quiz to lesson-1 if missing
    if (lesson && !lesson.quiz && lessonId === "lesson-1" && slug === "intro-math-olympiad") {
      lesson = { ...lesson, quiz: dummyLesson.quiz }
    }
  }

  const lessonIndex = course.lessons.findIndex((l: any) => l.id === lessonId)
  const previousLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null

  // Allow navigation even if lesson not found - show error message instead
  if (!lesson) {
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
              <p className="text-sm text-muted-foreground">Lesson not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check enrollment
  let enrollment = null
  let isCompleted = false
  
  if (course && lesson && session?.user?.id) {
    try {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      })

      if (enrollment) {
        // Check if lesson is completed
        const progress = await prisma.progress.findUnique({
          where: {
            userId_lessonId_enrollmentId: {
              userId: session.user.id,
              lessonId: lesson.id,
              enrollmentId: enrollment.id,
            },
          },
        })

        isCompleted = progress?.completed || false
      }
    } catch (error) {
      console.warn('Could not check enrollment/progress:', error)
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
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-gray-600 text-sm md:text-base mb-6">{lesson.description}</p>
            )}

            {lesson.videoUrl && (
              <div className="mb-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {lesson.content && (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="lesson-content"
                />
              </div>
            )}

            {!lesson.videoUrl && !lesson.content && (
              <p className="text-muted-foreground">Lesson content coming soon...</p>
            )}

            {(lesson.quiz || (lessonId === "lesson-1" && slug === "intro-math-olympiad")) && (
              <div className="mt-6 pt-6 border-t">
                <Link href={`/courses/${slug}/lessons/${lessonId}/quiz`}>
                  <Button size="lg" className="w-full">
                    Take Quiz
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            {previousLesson && (
              <Link href={`/courses/${slug}/lessons/${previousLesson.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
            {enrollment && (
              <MarkLessonCompleteButton
                lessonId={lesson.id}
                enrollmentId={enrollment.id}
                courseSlug={slug}
                isCompleted={isCompleted}
              />
            )}
          </div>

          <div>
            {nextLesson ? (
              <Link href={`/courses/${slug}/lessons/${nextLesson.id}`}>
                <Button>
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${slug}/learn`}>
                <Button variant="outline">
                  Back to Course
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
