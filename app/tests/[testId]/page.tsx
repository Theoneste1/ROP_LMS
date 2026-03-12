import { auth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { dummyTests, dummyPastPapers } from "@/lib/dummy-data"
import { TestDetailPageClient } from "./page-client"

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ testId: string }>
}) {
  const { testId } = await params
  const session = await auth()

  // Try to fetch test from database, fallback to dummy data
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
    console.warn('Database not available - using dummy data:', error)
    // Try to find in dummy data
    test = [...dummyTests, ...dummyPastPapers].find(t => t.id === testId) || null
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">Test not found</p>
              <Link href="/tests" className="mt-4 inline-block">
                <Button variant="outline">Back to Tests</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <TestDetailPageClient testId={testId} test={test} />
}
