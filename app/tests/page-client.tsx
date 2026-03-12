"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Clock, Award, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"

interface TestsPageClientProps {
  tests: any[]
  pastPapers: any[]
}

export function TestsPageClient({ tests, pastPapers }: TestsPageClientProps) {
  const handleDownload = (url: string, filename: string) => {
    if (url) {
      const link = document.createElement("a")
      link.href = url
      link.download = filename || "download.pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-[#0891B2] to-[#065F46] text-white">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">Test Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0C1E33] via-[#0891B2] to-[#065F46] bg-clip-text text-transparent mb-4">
            Tests & Past Papers
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Practice with timed tests and review Olympiad past papers with detailed solutions
          </p>
        </div>

        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="tests" className="text-sm md:text-base">
              <FileText className="h-4 w-4 mr-2" />
              Practice Tests
            </TabsTrigger>
            <TabsTrigger value="past-papers" className="text-sm md:text-base">
              <BookOpen className="h-4 w-4 mr-2" />
              Past Papers
            </TabsTrigger>
          </TabsList>

          {/* Practice Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No tests available</h3>
                      <p className="text-sm text-gray-600">
                        Check back later for new practice tests
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                tests.map((test: any) => (
                  <Card key={test.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="bg-[#0891B2]/10 text-[#0891B2]">
                          Practice Test
                        </Badge>
                        {test.timeLimit && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {test.timeLimit}m
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
                      {test.description && (
                        <CardDescription className="text-sm line-clamp-2 mt-2">
                          {test.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {test.totalMarks && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          <span>{test.totalMarks} marks</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {test.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-sm"
                            onClick={() => handleDownload(test.documentUrl, test.documentName || "test.pdf")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 text-sm bg-[#0891B2] hover:bg-[#0891B2]/90"
                        >
                          <Link href={`/tests/${test.id}`}>
                            Start Test
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Past Papers Tab */}
          <TabsContent value="past-papers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastPapers.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No past papers available</h3>
                      <p className="text-sm text-gray-600">
                        Check back later for Olympiad past papers
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                pastPapers.map((paper: any) => (
                  <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="bg-[#065F46]/10 text-[#065F46]">
                          {paper.olympiadType || "Past Paper"}
                        </Badge>
                        {paper.year && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {paper.year}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                      {paper.description && (
                        <CardDescription className="text-sm line-clamp-2 mt-2">
                          {paper.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paper.totalMarks && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          <span>{paper.totalMarks} marks</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        {paper.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-sm"
                            onClick={() => handleDownload(paper.documentUrl, paper.documentName || "questions.pdf")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Questions
                          </Button>
                        )}
                        {paper.solutionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-sm border-[#065F46] text-[#065F46] hover:bg-[#065F46]/10"
                            onClick={() => handleDownload(paper.solutionUrl, paper.solutionName || "solutions.pdf")}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Download Solutions
                          </Button>
                        )}
                        <Button
                          asChild
                          size="sm"
                          className="w-full text-sm bg-[#065F46] hover:bg-[#065F46]/90"
                        >
                          <Link href={`/tests/${paper.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
