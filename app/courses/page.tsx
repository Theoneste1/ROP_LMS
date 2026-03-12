import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { dummyCourses } from "@/lib/dummy-data"

export default async function CoursesPage() {
  // Try to fetch from database, fallback to dummy data
  let courses = []
  try {
    courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
      },
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
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    // If database fails, use dummy data
    console.warn('Database not available - using dummy data:', error)
    courses = dummyCourses.filter(c => c.status === "PUBLISHED") as any
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-[#0891B2]/10 to-[#065F46]/10 border border-[#0891B2]/20">
            <Sparkles className="h-4 w-4 text-[#0891B2]" />
            <span className="text-sm font-medium text-[#0891B2]">Premium Courses</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0C1E33] via-[#0891B2] to-[#065F46] bg-clip-text text-transparent mb-4">
            Course Catalog
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Discover comprehensive courses designed to help you excel in Mathematics Olympiad competitions
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0891B2]/10 to-[#065F46]/10 mb-6">
                <BookOpen className="h-10 w-10 text-[#0891B2]" />
              </div>
                  <h3 className="text-lg font-semibold mb-2">No courses available</h3>
              <p className="text-muted-foreground">
                Check back soon for new courses!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: { id: string; title: string; description: string | null; slug: string; instructor: { name: string | null; email: string }; lessons: unknown[]; _count: { enrollments: number } }) => (
              <Card 
                key={course.id} 
                className="group hover:shadow-2xl hover:shadow-[#0891B2]/20 transition-all duration-300 flex flex-col overflow-hidden border-2 hover:border-[#0891B2]/30 bg-white"
              >
                {/* Gradient header */}
                <div className="h-2 bg-gradient-to-r from-[#0891B2] via-[#0C1E33] to-[#065F46]" />
                
                <CardHeader className="pb-4">
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-[#0891B2] transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0891B2] to-[#065F46] flex items-center justify-center text-white text-xs font-semibold">
                      {(course.instructor.name || course.instructor.email).charAt(0).toUpperCase()}
                    </div>
                    <span>by {course.instructor.name || course.instructor.email}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                    {course.description || "No description available"}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-[#0891B2]/10">
                        <BookOpen className="h-4 w-4 text-[#0891B2]" />
                      </div>
                      <span className="font-medium">{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-[#065F46]/10">
                        <Users className="h-4 w-4 text-[#065F46]" />
                      </div>
                      <span className="font-medium">{course._count.enrollments} students</span>
                    </div>
                  </div>
                  
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-gradient-to-r from-[#0891B2] to-[#0C1E33] hover:from-[#0891B2]/90 hover:to-[#0C1E33]/90 shadow-lg shadow-[#0891B2]/20 hover:shadow-xl hover:shadow-[#0891B2]/30 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
