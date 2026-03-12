import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  instructorId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Authentication disabled - allow all access
    const session = await auth()

    const body = await request.json()
    const data = courseSchema.parse(body)

    // Use provided instructorId, or get/create a default instructor
    let instructorId = data.instructorId
    if (!instructorId || instructorId === "") {
      // Try to find an existing instructor user
      const instructor = await prisma.user.findFirst({
        where: {
          role: "INSTRUCTOR",
        },
      })
      
      if (instructor) {
        instructorId = instructor.id
      } else {
        // Create a default instructor if none exists
        const defaultInstructor = await prisma.user.create({
          data: {
            email: `instructor-${Date.now()}@rolms.local`,
            name: "Default Instructor",
            role: "INSTRUCTOR",
          },
        })
        instructorId = defaultInstructor.id
      }
    }

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: data.slug },
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        status: data.status,
        instructorId: instructorId,
      },
    })

    return NextResponse.json(
      { message: "Course created successfully", course },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create course error:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication disabled - allow all access
    const session = await auth()

    // Get all courses (no filtering by instructor for now)
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
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

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    // Return dummy data on error
    const { dummyCourses } = await import("@/lib/dummy-data")
    return NextResponse.json({ courses: dummyCourses as any })
  }
}
