import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CreateCourseForm } from "@/components/instructor/create-course-form"

export default async function NewCoursePage() {
  const session = await auth()

  // Authentication optional

  // Role check disabled

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create your course</p>
        </div>

        <CreateCourseForm instructorId={session?.user?.id || ""} />
      </div>
    </div>
  )
}
