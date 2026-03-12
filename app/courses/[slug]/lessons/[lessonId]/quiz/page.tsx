import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { QuizAttemptForm } from "@/components/courses/quiz-attempt-form"
import { prisma } from "@/lib/prisma"
import { dummyLesson, dummyCourse, dummyCourses } from "@/lib/dummy-data"

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const session = await auth()

  // Authentication optional

  // Try to fetch from database, fallback to dummy data
  let course = null
  try {
    course = await prisma.course.findUnique({
      where: {
        slug: slug,
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    course = dummyCourses.find(c => c.slug === slug) || 
      (slug === dummyCourse.slug ? dummyCourse : null) as any
  }
  
  let lesson = null
  try {
    lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        course: true,
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
    lesson = course?.lessons.find((l: any) => l.id === lessonId) || 
      (lessonId === dummyLesson.id ? dummyLesson : null)
    
    // If lesson doesn't have quiz but it's lesson-1, add quiz from dummyLesson
    if (lesson && !lesson.quiz && lessonId === "lesson-1" && slug === "intro-math-olympiad") {
      lesson = { ...lesson, quiz: dummyLesson.quiz }
    }
  }

  // Allow navigation - show error message if lesson/quiz not found instead of redirecting
  if (!lesson || !lesson.quiz) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href={`/courses/${slug}/lessons/${lessonId}`}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lesson
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {!lesson ? "Lesson not found" : "Quiz not found for this lesson"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Check enrollment
  let enrollment = null
  if (lesson && session?.user?.id) {
    try {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: lesson.courseId,
          },
        },
      })
    } catch (error) {
      console.warn('Could not check enrollment:', error)
    }
  }

  // Check for existing attempt
  let existingAttempt = null
  if (lesson?.quiz && session?.user?.id) {
    try {
      existingAttempt = await prisma.quizAttempt.findFirst({
        where: {
          quizId: lesson.quiz.id,
          userId: session.user.id,
        },
        orderBy: {
          startedAt: "desc",
        },
      })
    } catch (error) {
      console.warn('Could not get quiz attempt:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/courses/${slug}/lessons/${lessonId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.quiz.title}</h1>
          {lesson.quiz.description && (
            <p className="text-gray-600 mt-2">{lesson.quiz.description}</p>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <span>
                <strong>Questions:</strong> {lesson.quiz.questions.length}
              </span>
              <span>
                <strong>Passing Score:</strong> {lesson.quiz.passingScore}%
              </span>
              {lesson.quiz.timeLimit && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    <strong>Time Limit:</strong> {lesson.quiz.timeLimit} minutes
                  </span>
                </div>
              )}
            </div>
            {existingAttempt && existingAttempt.completed && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Previous Attempt:</strong> Score: {existingAttempt.score || 0}%
                  {existingAttempt.score && existingAttempt.score >= lesson.quiz.passingScore
                    ? " ✓ Passed"
                    : " ✗ Failed"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {existingAttempt && existingAttempt.completed ? (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Completed</CardTitle>
              <CardDescription>
                You have already completed this quiz. You can review your answers below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-base font-semibold">
                    Score: {existingAttempt.score || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {existingAttempt.score && existingAttempt.score >= lesson.quiz.passingScore
                      ? "Congratulations! You passed the quiz."
                      : `You need ${lesson.quiz.passingScore}% to pass.`}
                  </p>
                </div>
                <Link href={`/courses/${slug}/lessons/${lessonId}/quiz/results/${existingAttempt.id}`}>
                  <Button>View Results</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <QuizAttemptForm
            quiz={lesson.quiz}
            courseSlug={slug}
            lessonId={lessonId}
            existingAttempt={existingAttempt}
          />
        )}
      </div>
    </div>
  )
}
