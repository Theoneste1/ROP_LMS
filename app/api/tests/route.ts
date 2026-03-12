import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    // Authentication optional for testing - allow viewing tests without login
    // In production, you may want to require authentication

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "PRACTICE_TEST" or "PAST_PAPER"

    let tests = []
    try {
      const where: any = {
        status: "PUBLISHED",
      }
      
      if (type) {
        where.type = type
      }

      tests = await prisma.test.findMany({
        where,
        orderBy: {
          createdAt: "desc",
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
      // Return empty array if database is not available
      return NextResponse.json({ tests: [] })
    }

    return NextResponse.json({ tests })
  } catch (error) {
    console.error("Get tests error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    // Authentication required for creating tests
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only instructors and admins can create tests
    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      year,
      olympiadType,
      documentUrl,
      documentName,
      solutionUrl,
      solutionName,
      timeLimit,
      totalMarks,
      status = "DRAFT",
    } = body

    const test = await prisma.test.create({
      data: {
        title,
        description,
        type: type || "PRACTICE_TEST",
        year,
        olympiadType,
        documentUrl,
        documentName,
        solutionUrl,
        solutionName,
        timeLimit,
        totalMarks,
        status: status || "DRAFT",
        createdById: session.user.id,
      },
    })

    return NextResponse.json({ test }, { status: 201 })
  } catch (error) {
    console.error("Create test error:", error)
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    )
  }
}
