import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { lessonId } = await params
    const body = await request.json()
    const { enrollmentId } = body

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "Enrollment ID is required" },
        { status: 400 }
      )
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
    })

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId_enrollmentId: {
          userId: session.user.id,
          lessonId: lessonId,
          enrollmentId: enrollmentId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        enrollmentId: enrollmentId,
        completed: true,
        completedAt: new Date(),
      },
    })

    return NextResponse.json(
      { message: "Lesson marked as complete", progress },
      { status: 200 }
    )
  } catch (error) {
    console.error("Complete lesson error:", error)
    return NextResponse.json(
      { error: "Failed to mark lesson as complete" },
      { status: 500 }
    )
  }
}
