import { handlers } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Wrap handlers to catch errors and return valid JSON instead of HTML error pages
export async function GET(request: NextRequest) {
  try {
    const response = await handlers.GET(request)
    // Ensure response is JSON
    if (response && response.headers.get('content-type')?.includes('application/json')) {
      return response
    }
    // If response is not JSON, return JSON anyway
    return NextResponse.json(
      { 
        user: null,
        expires: null 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  } catch (error: any) {
    // Return valid JSON instead of error page when NextAuth fails
    // This prevents "Unexpected token '<'" errors
    return NextResponse.json(
      { 
        user: null,
        expires: null 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await handlers.POST(request)
    // Ensure response is JSON
    if (response && response.headers.get('content-type')?.includes('application/json')) {
      return response
    }
    // If response is not JSON, return JSON anyway
    return NextResponse.json(
      { 
        user: null,
        expires: null 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  } catch (error: any) {
    // Return valid JSON instead of error page when NextAuth fails
    return NextResponse.json(
      { 
        user: null,
        expires: null 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  }
}
