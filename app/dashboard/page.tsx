import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Clock, FileText, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { prisma } from "@/lib/prisma"
import { dummyEnrollments, dummyAssignments } from "@/lib/dummy-data"

export default async function DashboardPage() {
  const session = await auth()
  // Authentication optional - allow access without login

  // Try to fetch from database, fallback to dummy data
  let enrollments: any[] = []
  try {
    if (session?.user?.id) {
      enrollments = await prisma.enrollment.findMany({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
        include: {
          course: {
            include: {
              instructor: true,
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
          },
        },
      })
    } else {
      // Use dummy data when not logged in
      enrollments = dummyEnrollments as any
    }
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    enrollments = dummyEnrollments as any
  }

  const totalCourses = enrollments.length
  const totalLessons = enrollments?.reduce(
    (acc: number, enrollment: { course: { lessons: unknown[] } }) => acc + enrollment.course.lessons.length,
    0
  ) || 0

  // Get progress count from database
  let completedLessons = 0
  try {
    if (session?.user?.id) {
      completedLessons = await prisma.progress.count({
        where: {
          userId: session.user.id,
          completed: true,
        },
      })
    } else {
      // Use dummy progress when not logged in
      completedLessons = dummyProgress.filter(p => p.completed).length
    }
  } catch (error) {
    console.warn('Could not get completed lessons:', error)
    completedLessons = dummyProgress.filter(p => p.completed).length
  }

  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  // Get assignments from database
  let assignments: any[] = []
  if (session?.user?.id) {
    try {
      assignments = await prisma.assignment.findMany({
        where: {
          course: {
            enrollments: {
              some: {
                userId: session.user.id,
                status: "ACTIVE",
              },
            },
          },
        },
        include: {
          course: true,
          submissions: {
            where: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          dueDate: "asc",
        },
      })
    } catch (error) {
      console.warn('Could not get assignments:', error)
      assignments = dummyAssignments as any
    }
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "from-[#0891B2] to-[#0C1E33]",
      bgColor: "bg-[#0891B2]/10",
    },
    {
      title: "Total Lessons",
      value: totalLessons,
      icon: Clock,
      color: "from-[#065F46] to-[#0891B2]",
      bgColor: "bg-[#065F46]/10",
    },
    {
      title: "Completed",
      value: completedLessons,
      icon: Award,
      color: "from-[#FBBF24] to-[#FCD34D]",
      bgColor: "bg-[#FBBF24]/10",
    },
    {
      title: "Progress",
      value: `${progressPercentage}%`,
      icon: TrendingUp,
      color: "from-[#0891B2] to-[#065F46]",
      bgColor: "bg-gradient-to-br from-[#0891B2]/10 to-[#065F46]/10",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#065F46]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0C1E33] via-[#0891B2] to-[#065F46] bg-clip-text text-transparent">
              Welcome back, {session?.user?.name || session?.user?.email || "Guest"}!
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            {session?.user?.role === "INSTRUCTOR" || session?.user?.role === "ADMIN"
              ? "Manage your courses and students"
              : "Continue your learning journey"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="group hover:shadow-xl hover:shadow-[#0891B2]/10 transition-all duration-300 border-2 hover:border-[#0891B2]/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.title === "Progress" ? "Overall completion" : stat.title === "Completed" ? "Lessons completed" : stat.title === "Total Lessons" ? "Available lessons" : "Active enrollments"}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-[#0891B2] to-[#0C1E33] hover:from-[#0891B2]/90 hover:to-[#0C1E33]/90">
                Browse All Courses
              </Button>
            </Link>
          </div>

          {(!enrollments || enrollments.length === 0) ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0891B2]/10 to-[#065F46]/10 mb-6">
                  <BookOpen className="h-10 w-10 text-[#0891B2]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start learning by enrolling in a course
                </p>
                <Link href="/courses">
                  <Button className="bg-gradient-to-r from-[#0891B2] to-[#0C1E33]">Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment: { id: string; course: { id: string; title: string; slug: string; description: string | null; instructor: { name: string | null }; lessons: unknown[]; _count: { enrollments: number } }; createdAt: Date }) => (
                <Card key={enrollment.id} className="group hover:shadow-xl hover:shadow-[#0891B2]/10 transition-all duration-300 border-2 hover:border-[#0891B2]/30">
                  <div className="h-1 bg-gradient-to-r from-[#0891B2] via-[#0C1E33] to-[#065F46]" />
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-[#0891B2] transition-colors">{enrollment.course.title}</CardTitle>
                    <CardDescription>
                      by {enrollment.course.instructor.name || "Instructor"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {enrollment.course.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-[#0891B2]" />
                        {enrollment.course.lessons.length} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-[#065F46]" />
                        {enrollment.course._count.enrollments} students
                      </span>
                    </div>
                    <Link href={`/courses/${enrollment.course.slug}`}>
                      <Button className="w-full bg-gradient-to-r from-[#0891B2] to-[#0C1E33] hover:from-[#0891B2]/90 hover:to-[#0C1E33]/90">
                        Continue Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Assignments Section */}
        {assignments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.slice(0, 4).map((assignment: { id: string; title: string; course: { title: string; slug: string }; dueDate: Date | null; submissions: Array<{ status: string }> }) => {
                const submission = assignment.submissions[0] as { status: string } | undefined
                return (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow border-2">
                    <CardHeader>
                      <CardTitle className="text-base">{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.course.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {assignment.dueDate
                            ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
                            : "No due date"}
                        </span>
                        {submission ? (
                          <Badge variant={submission.status === "GRADED" ? "default" : "secondary"}>
                            {submission.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not submitted</Badge>
                        )}
                      </div>
                      <Link href={`/courses/${assignment.course.slug}/assignments/${assignment.id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          {submission ? "View Submission" : "Submit Assignment"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Instructor Section */}
        {(session?.user?.role === "INSTRUCTOR" || session?.user?.role === "ADMIN") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Teaching</h2>
              <Link href="/instructor/courses/new">
                <Button className="bg-gradient-to-r from-[#0891B2] to-[#0C1E33]">Create New Course</Button>
              </Link>
            </div>
            <Link href="/instructor/dashboard">
              <Button variant="outline">Go to Instructor Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
