import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const CourseStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const

const statusSchema = z.object({
  status: z.nativeEnum(CourseStatus),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()

    // Role check disabled - allow all access

    const { courseId } = await params
    const body = await request.json()
    const data = statusSchema.parse(body)

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { status: data.status },
    })

    return NextResponse.json({
      message: "Course status updated successfully",
      course,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update course status error:", error)
    return NextResponse.json(
      { error: "Failed to update course status" },
      { status: 500 }
    )
  }
}
