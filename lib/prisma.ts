import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize PrismaClient with error handling
// Prisma 6 reads DATABASE_URL from environment variables automatically
let prismaInstance: PrismaClient

try {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma
  } else {
    // Prisma 6 reads DATABASE_URL from process.env automatically
    prismaInstance = new PrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
  }
} catch (error: any) {
  // If PrismaClient fails to initialize, log warning but don't crash
  console.error('⚠️ PrismaClient initialization failed:', error?.message || error)
  // Try to create instance anyway - it might work in some contexts
  try {
    prismaInstance = new PrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
  } catch (e: any) {
    // If still fails, create a mock that throws helpful errors
    console.error('❌ PrismaClient initialization failed completely:', e?.message || e)
    // Create a proxy that throws helpful errors
    prismaInstance = new Proxy({} as PrismaClient, {
      get() {
        throw new Error('Cannot initialize PrismaClient. Database connection failed. Check: 1) Supabase project is Active, 2) Tables exist, 3) RLS is disabled, 4) DATABASE_URL is correct in .env.local')
      }
    }) as PrismaClient
  }
}

export const prisma = prismaInstance
