import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const assignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  maxScore: z.number().int().min(1).max(1000),
  dueDate: z.string().datetime().optional(),
  courseId: z.string(),
  instructorId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = assignmentSchema.parse(body)

    // Verify instructor matches session
    if (data.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        maxScore: data.maxScore,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        courseId: data.courseId,
        instructorId: data.instructorId,
      },
    })

    return NextResponse.json(
      { message: "Assignment created successfully", assignment },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create assignment error:", error)
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    )
  }
}
