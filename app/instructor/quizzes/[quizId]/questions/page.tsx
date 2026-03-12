import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { QuestionList } from "@/components/instructor/question-list"

export default async function QuizQuestionsPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const session = await auth()

  // Authentication optional

  // Role check disabled

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
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
  })

  if (!quiz) {
    redirect("/instructor/dashboard")
  }

  // Verify ownership
  // Role check disabled - allow all access

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/instructor/courses/${quiz.lesson.courseId}/lessons/${quiz.lessonId}/edit`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-2">
            Manage quiz questions ({quiz.questions.length} questions)
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Add questions to your quiz
                </CardDescription>
              </div>
              <Link href={`/instructor/quizzes/${quizId}/questions/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <QuestionList quizId={quizId} questions={quiz.questions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
