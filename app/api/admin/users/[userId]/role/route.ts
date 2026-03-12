import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const UserRole = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
} as const

const roleSchema = z.object({
  role: z.nativeEnum(UserRole),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    // Role check disabled - allow all access

    const { userId } = await params
    // Prevent changing own role
    if (session?.user?.id && userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = roleSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: data.role },
    })

    return NextResponse.json({
      message: "User role updated successfully",
      user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update user role error:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}
