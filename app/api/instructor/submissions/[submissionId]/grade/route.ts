import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const gradeSchema = z.object({
  score: z.number().int().min(0),
  feedback: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { submissionId } = await params
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Verify assignment ownership
    if (
      submission.assignment.instructorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = gradeSchema.parse(body)

    // Verify score doesn't exceed max score
    if (data.score > submission.assignment.maxScore) {
      return NextResponse.json(
        { error: `Score cannot exceed ${submission.assignment.maxScore}` },
        { status: 400 }
      )
    }

    // Update submission
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: data.score,
        feedback: data.feedback,
        status: "GRADED",
        gradedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "Submission graded successfully",
      submission: updatedSubmission,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Grade submission error:", error)
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    )
  }
}
