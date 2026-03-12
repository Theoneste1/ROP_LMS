import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth()
    // Authentication optional for testing
    const { testId } = await params

    let test = null
    try {
      test = await prisma.test.findUnique({
        where: {
          id: testId,
          status: "PUBLISHED",
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
    } catch (error) {
      console.warn('Database not available:', error)
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json({ test })
  } catch (error) {
    console.error("Get test error:", error)
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only instructors and admins can update tests
    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { testId } = await params
    const body = await request.json()

    // Check if test exists and user has permission
    const existingTest = await prisma.test.findUnique({
      where: { id: testId },
    })

    if (!existingTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Only creator or admin can update
    if (existingTest.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const test = await prisma.test.update({
      where: { id: testId },
      data: body,
    })

    return NextResponse.json({ test })
  } catch (error) {
    console.error("Update test error:", error)
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can delete tests
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { testId } = await params

    await prisma.test.delete({
      where: { id: testId },
    })

    return NextResponse.json({ message: "Test deleted successfully" })
  } catch (error) {
    console.error("Delete test error:", error)
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    )
  }
}
