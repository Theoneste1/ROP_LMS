import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Authentication disabled - allow all routes to be accessed without login
export async function middleware(request: NextRequest) {
  // Allow all requests to pass through without authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [], // Empty matcher means middleware won't run (all routes accessible)
}
