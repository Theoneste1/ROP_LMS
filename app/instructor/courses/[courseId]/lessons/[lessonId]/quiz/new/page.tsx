import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreateQuizForm } from "@/components/instructor/create-quiz-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const session = await auth()

  // Authentication optional

  // Role check disabled

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: true,
    },
  })

  if (!lesson) {
    redirect(`/instructor/courses/${courseId}/edit`)
  }

  // Verify ownership
  // Role check disabled - allow all access

  // Check if quiz already exists
  const existingQuiz = await prisma.quiz.findUnique({
    where: {
      lessonId: lessonId,
    },
  })

  if (existingQuiz) {
    redirect(`/instructor/courses/${courseId}/lessons/${lessonId}/quiz/edit`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/instructor/courses/${courseId}/lessons/${lessonId}/edit`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Quiz</h1>
          <p className="text-gray-600 mt-2">Add a quiz to {lesson.title}</p>
        </div>

        <CreateQuizForm lessonId={lessonId} />
      </div>
    </div>
  )
}
