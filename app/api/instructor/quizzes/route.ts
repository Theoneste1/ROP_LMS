import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  timeLimit: z.number().int().min(1).optional(),
  passingScore: z.number().int().min(0).max(100),
  lessonId: z.string(),
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
    const data = quizSchema.parse(body)

    // Verify lesson ownership
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
      include: {
        course: true,
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    if (
      lesson.course.instructorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if quiz already exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { lessonId: data.lessonId },
    })

    if (existingQuiz) {
      return NextResponse.json(
        { error: "Quiz already exists for this lesson" },
        { status: 400 }
      )
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        timeLimit: data.timeLimit,
        passingScore: data.passingScore,
        lessonId: data.lessonId,
      },
    })

    return NextResponse.json(
      { message: "Quiz created successfully", quiz },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create quiz error:", error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    )
  }
}
