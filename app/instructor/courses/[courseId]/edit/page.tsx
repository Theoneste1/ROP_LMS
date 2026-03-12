import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Edit, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { EditCourseForm } from "@/components/instructor/edit-course-form"
import { LessonList } from "@/components/instructor/lesson-list"
import { AssignmentList } from "@/components/instructor/assignment-list"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const session = await auth()

  // Authentication optional

  // Role check disabled

  let course = null
  try {
    course = await prisma.course.findUnique({
      where: {
        id: courseId,
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
                questions: true,
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
    const { dummyCourses } = await import("@/lib/dummy-data")
    course = dummyCourses.find(c => c.id === courseId) as any
  }

  if (!course) {
    redirect("/instructor/dashboard")
  }

  // Verify ownership
  // Role check disabled - allow all access

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/instructor/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">{course.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <EditCourseForm course={course} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lessons</CardTitle>
                    <CardDescription>
                      Manage the lessons in this course
                    </CardDescription>
                  </div>
                  <Link href={`/instructor/courses/${course.id}/lessons/new`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <LessonList courseId={course.id} lessons={course.lessons} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>
                      Manage assignments for this course
                    </CardDescription>
                  </div>
                  <Link href={`/instructor/courses/${course.id}/assignments/new`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Assignment
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <AssignmentList courseId={course.id} assignments={course.assignments} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{course.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="font-medium">{course.lessons.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{course._count.enrollments}</p>
                </div>
                <div className="pt-4 border-t">
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline" className="w-full">
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
