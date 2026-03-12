import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists (with error handling)
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      })
    } catch (prismaError: any) {
      console.error("Prisma error checking existing user:", prismaError)
      return NextResponse.json(
        { 
          error: "Database error. Please ensure the database is set up correctly.",
          details: process.env.NODE_ENV === 'development' ? prismaError?.message : undefined
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (with error handling)
    let user
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "STUDENT",
        },
      })
    } catch (createError: any) {
      console.error("Prisma create error:", createError)
      if (createError?.code === 'P2002') {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Failed to create user. Database error: " + (createError?.message || "Unknown error") },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    console.error("Error stack:", error?.stack)
    
    // Provide more specific error messages
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    if (error?.message?.includes('PrismaClient') || error?.message?.includes('Cannot find PrismaClient')) {
      return NextResponse.json(
        { 
          error: "Database connection error. Please check your database setup.",
          details: process.env.NODE_ENV === 'development' ? error?.message : undefined
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { 
        error: error?.message || "Failed to create account. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
