import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // Authentication disabled - allow all access
    const { courseId } = await params
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const body = await request.json()
    const data = updateCourseSchema.parse(body)

    // Check if slug already exists (if slug is being updated)
    if (data.slug && data.slug !== course.slug) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug: data.slug },
      })

      if (existingCourse) {
        return NextResponse.json(
          { error: "A course with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data,
    })

    return NextResponse.json({
      message: "Course updated successfully",
      course: updatedCourse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update course error:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // Authentication disabled - allow all access
    const { courseId } = await params
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Delete course (cascade will delete lessons, enrollments, etc.)
    await prisma.course.delete({
      where: { id: courseId },
    })

    return NextResponse.json({
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("Delete course error:", error)
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    )
  }
}
