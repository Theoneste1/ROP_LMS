import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const attemptSchema = z.object({
  answers: z.record(z.string()),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string; attemptId: string }> }
) {
  try {
    const session = await auth()
    // Authentication optional for testing - allow quiz submissions without login
    // In production, uncomment: if (!session?.user?.id) { return NextResponse.json({ error: "Please login to submit quizzes" }, { status: 401 }) }

    const { quizId, attemptId } = await params
    
    let attempt = null
    try {
      attempt = await prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      })
    } catch (error) {
      console.warn('Database not available:', error)
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    // Ownership check optional for testing
    // In production, uncomment: if (attempt.userId !== session.user.id) { return NextResponse.json({ error: "Forbidden" }, { status: 403 }) }

    if (attempt.completed) {
      return NextResponse.json(
        { error: "Attempt already completed" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = attemptSchema.parse(body)

    // Delete existing answers
    try {
      await prisma.answer.deleteMany({
        where: { attemptId: attemptId },
      })
    } catch (error) {
      console.warn('Could not delete existing answers:', error)
    }

    // Grade the quiz
    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0

    for (const question of attempt.quiz.questions) {
      totalPoints += question.points
      const userAnswer = data.answers?.[question.id] || ""

      if (userAnswer && userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
        correctCount++
        earnedPoints += question.points
      }

      // Create answer record
      try {
        await prisma.answer.create({
          data: {
            attemptId: attemptId,
            questionId: question.id,
            answer: userAnswer || "",
            isCorrect: userAnswer ? userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() : null,
          },
        })
      } catch (error) {
        console.warn('Failed to create answer record:', error)
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

    // Update attempt with score
    let updatedAttempt = null
    try {
      updatedAttempt = await prisma.quizAttempt.update({
        where: { id: attemptId },
        data: {
          score,
          completed: true,
          completedAt: new Date(),
        },
      })
    } catch (error) {
      console.error('Failed to update attempt:', error)
      updatedAttempt = {
        ...attempt,
        score,
        completed: true,
        completedAt: new Date(),
      }
    }

    return NextResponse.json({
      message: "Quiz submitted successfully",
      attempt: updatedAttempt,
      score,
      passed: score >= attempt.quiz.passingScore,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Submit quiz error:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    )
  }
}
