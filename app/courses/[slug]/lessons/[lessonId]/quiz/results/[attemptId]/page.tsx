import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { dummyQuiz, dummyCourse } from "@/lib/dummy-data"

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string; attemptId: string }>
}) {
  const { slug, lessonId, attemptId } = await params
  const session = await auth()

  // Authentication optional

  // Try to fetch from database, fallback to dummy data
  let attempt = null
  try {
    attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                course: true,
              },
            },
            questions: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    attempt = {
      id: attemptId,
      quizId: dummyQuiz.id,
      userId: session?.user?.id || "user-1",
      score: 85,
      completed: true,
      startedAt: new Date(),
      completedAt: new Date(),
      quiz: dummyQuiz,
      answers: dummyQuiz.questions.map((q: any) => ({
        id: `answer-${q.id}`,
        questionId: q.id,
        answer: q.correctAnswer,
        isCorrect: true,
        question: q,
      })),
    } as any
  }

  // Allow navigation - show error message if attempt not found instead of redirecting
  if (!attempt) {
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
              <p className="text-sm text-muted-foreground">Quiz attempt not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Allow guest access - no redirect needed for viewing results

  const passed = attempt.score !== null && attempt.score >= attempt.quiz.passingScore

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">{attempt.quiz.title}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {attempt.score || 0}%
                </p>
                <p className="text-muted-foreground">
                  Passing Score: {attempt.quiz.passingScore}%
                </p>
              </div>
              <div>
                {passed ? (
                  <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Passed
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <XCircle className="h-5 w-5 mr-2" />
                    Failed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Question Review</h2>
          {attempt.quiz.questions.map((question: { id: string; question: string; type: string; options: string | null; correctAnswer: string; points: number }, index: number) => {
            const answer = attempt.answers.find((a: { questionId: string }) => a.questionId === question.id)
            const isCorrect = answer?.isCorrect || false

            let options: string[] = []
            try {
              options = question.options ? JSON.parse(question.options) : []
            } catch (e) {
              // Invalid JSON
            }

            return (
              <Card key={question.id} className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Question {index + 1} ({question.points} point{question.points !== 1 ? "s" : ""})
                    </CardTitle>
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{question.question}</p>

                  {question.type === "multiple_choice" && options.length > 0 && (
                    <div className="space-y-2">
                      {options.map((option, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded ${
                            option === question.correctAnswer
                              ? "bg-green-200 font-semibold"
                              : option === answer?.answer
                              ? "bg-red-200"
                              : ""
                          }`}
                        >
                          {option}
                          {option === question.correctAnswer && " ✓ Correct"}
                          {option === answer?.answer && option !== question.correctAnswer && " ✗ Your Answer"}
                        </div>
                      ))}
                    </div>
                  )}

                  {(question.type === "true_false" || question.type === "short_answer") && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Correct Answer: {question.correctAnswer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600">
                          Your Answer: {answer?.answer || "No answer provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6">
          <Link href={`/courses/${slug}/lessons/${lessonId}`}>
            <Button>Continue to Next Lesson</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
