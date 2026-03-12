import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreateQuestionForm } from "@/components/instructor/create-question-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewQuestionPage({
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
          order: "desc",
        },
        take: 1,
      },
    },
  })

  if (!quiz) {
    redirect("/instructor/dashboard")
  }

  // Verify ownership
  // Role check disabled - allow all access

  const nextOrder = quiz.questions.length > 0 ? quiz.questions[0].order + 1 : 1

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/instructor/quizzes/${quizId}/questions`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Question</h1>
          <p className="text-gray-600 mt-2">Add a question to {quiz.title}</p>
        </div>

        <CreateQuestionForm quizId={quizId} defaultOrder={nextOrder} />
      </div>
    </div>
  )
}
