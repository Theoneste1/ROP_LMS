import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const lessonSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(["VIDEO", "TEXT", "QUIZ", "ASSIGNMENT"]),
  order: z.number().int().min(1),
  courseId: z.string(),
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
    const data = lessonSchema.parse(body)

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

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        videoUrl: data.videoUrl || undefined,
        type: data.type,
        order: data.order,
        courseId: data.courseId,
      },
    })

    return NextResponse.json(
      { message: "Lesson created successfully", lesson },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create lesson error:", error)
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    )
  }
}
