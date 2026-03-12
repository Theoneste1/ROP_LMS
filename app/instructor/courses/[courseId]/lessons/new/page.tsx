import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreateLessonForm } from "@/components/instructor/create-lesson-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const session = await auth()

  // Authentication optional

  // Role check disabled

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "desc",
        },
        take: 1,
      },
    },
  })

  if (!course) {
    redirect("/instructor/dashboard")
  }

  // Verify ownership
  // Role check disabled - allow all access

  const nextOrder = course.lessons.length > 0 ? course.lessons[0].order + 1 : 1

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={`/instructor/courses/${courseId}/edit`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Lesson</h1>
          <p className="text-gray-600 mt-2">Add a new lesson to {course.title}</p>
        </div>

        <CreateLessonForm courseId={courseId} defaultOrder={nextOrder} />
      </div>
    </div>
  )
}
