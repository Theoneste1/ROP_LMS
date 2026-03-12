import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { dummyCourses } from "@/lib/dummy-data"
import { DeleteCourseButton } from "@/components/instructor/delete-course-button"

export default async function InstructorDashboardPage() {
  const session = await auth()

  // Authentication optional

  // Role check disabled - allow all access

  // Try to fetch from database, fallback to dummy data
  let courses: any[] = []
  try {
    // Get all courses (no filtering by instructor when auth is disabled)
    courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: [
            { topic: "asc" },
            { order: "asc" },
          ],
        },
        assignments: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    courses = dummyCourses as any
  }

  const totalCourses = courses.length
  const totalStudents = courses.reduce(
    (acc: number, course: { _count: { enrollments: number } }) => acc + course._count.enrollments,
    0
  )
  const totalLessons = courses.reduce(
    (acc: number, course: { lessons: unknown[] }) => acc + course.lessons.length,
    0
  )
  const publishedCourses = courses.filter((c: { status: string }) => c.status === "PUBLISHED").length

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your courses and students</p>
          </div>
          <Link href="/instructor/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {publishedCourses} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                Lessons created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{publishedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Active courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first course to get started
                </p>
                <Link href="/instructor/courses/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: { id: string; title: string; slug: string; status: string; description: string | null; _count: { enrollments: number }; lessons: unknown[] }) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-2 flex-1">{course.title}</CardTitle>
                      <Badge
                        variant={
                          course.status === "PUBLISHED"
                            ? "default"
                            : course.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {course.lessons.length} lessons • {course._count.enrollments} students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {course.description || "No description"}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          View
                        </Button>
                      </Link>
                      <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
