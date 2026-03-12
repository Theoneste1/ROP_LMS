import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const questionSchema = z.object({
  question: z.string().min(5),
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  options: z.string().nullable().optional(),
  correctAnswer: z.string().min(1),
  points: z.number().int().min(1),
  order: z.number().int().min(1),
  quizId: z.string(),
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
    const data = questionSchema.parse(body)

    // Verify quiz ownership
    const quiz = await prisma.quiz.findUnique({
      where: { id: data.quizId },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    if (
      quiz.lesson.course.instructorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        question: data.question,
        type: data.type,
        options: data.options,
        correctAnswer: data.correctAnswer,
        points: data.points,
        order: data.order,
        quizId: data.quizId,
      },
    })

    return NextResponse.json(
      { message: "Question created successfully", question },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create question error:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}
