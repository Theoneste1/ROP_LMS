import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { dummyTests, dummyPastPapers } from "@/lib/dummy-data"
import { TestsPageClient } from "./page-client"

export default async function TestsPage() {
  const session = await auth()

  // Try to fetch tests from database, fallback to dummy data
  let tests = []
  let pastPapers = []
  
  try {
    const dbTests = await prisma.test.findMany({
      where: {
        status: "PUBLISHED",
      },
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
    
    tests = dbTests.filter(t => t.type === "PRACTICE_TEST")
    pastPapers = dbTests.filter(t => t.type === "PAST_PAPER")
  } catch (error) {
    console.warn('Database not available - using dummy data:', error)
    tests = dummyTests
    pastPapers = dummyPastPapers
  }

  return <TestsPageClient tests={tests} pastPapers={pastPapers} />
}
