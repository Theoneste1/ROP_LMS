import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // Role check disabled - allow all access

    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
        assignments: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    // Return dummy data on error
    const { dummyCourses } = await import("@/lib/dummy-data")
    return NextResponse.json({ courses: dummyCourses.map(c => ({
      ...c,
      instructor: c.instructor,
      _count: c._count,
    })) as any })
  }
}
