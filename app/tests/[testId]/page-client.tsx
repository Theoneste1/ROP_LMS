"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, FileText, Clock, Award, Calendar, BookOpen, CheckCircle2, MessageSquare, Upload } from "lucide-react"
import Link from "next/link"
import { CommentSection } from "@/components/tests/comment-section"
import { TestSubmission } from "@/components/tests/test-submission"

interface TestDetailPageClientProps {
  testId: string
  test: any
}

export function TestDetailPageClient({ testId, test }: TestDetailPageClientProps) {
  const isPastPaper = test.type === "PAST_PAPER"

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/tests">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Button>
          </Link>
        </div>

        {/* Test Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {isPastPaper ? (
                  <Badge variant="secondary" className="bg-[#065F46]/10 text-[#065F46]">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {test.olympiadType || "Past Paper"}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-[#0891B2]/10 text-[#0891B2]">
                    <FileText className="h-3 w-3 mr-1" />
                    Practice Test
                  </Badge>
                )}
                {test.year && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {test.year}
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{test.title}</CardTitle>
            {test.description && (
              <CardDescription className="text-sm md:text-base mt-2">
                {test.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {test.timeLimit && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Time Limit</p>
                    <p className="text-sm font-semibold">{test.timeLimit} minutes</p>
                  </div>
                </div>
              )}
              {test.totalMarks && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Total Marks</p>
                    <p className="text-sm font-semibold">{test.totalMarks}</p>
                  </div>
                </div>
              )}
              {test.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Published</p>
                    <p className="text-sm font-semibold">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Download Materials</CardTitle>
            <CardDescription>
              {isPastPaper 
                ? "Download the questions and solutions for this past paper"
                : "Download the test questions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {test.documentUrl && (
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                onClick={() => handleDownload(test.documentUrl, test.documentName || "test.pdf")}
              >
                <Download className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">
                    {isPastPaper ? "Download Questions" : "Download Test"}
                  </div>
                  {test.documentName && (
                    <div className="text-xs text-gray-500">{test.documentName}</div>
                  )}
                </div>
              </Button>
            )}
            {test.solutionUrl && (
              <Button
                variant="outline"
                className="w-full justify-start border-[#065F46] text-[#065F46] hover:bg-[#065F46]/10"
                size="lg"
                onClick={() => handleDownload(test.solutionUrl, test.solutionName || "solutions.pdf")}
              >
                <FileText className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    Download Solutions
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  {test.solutionName && (
                    <div className="text-xs text-gray-500">{test.solutionName}</div>
                  )}
                </div>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isPastPaper ? (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] mt-0.5" />
                  <p>Download the questions PDF and attempt the problems on your own.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] mt-0.5" />
                  <p>After completing the test, download the solutions PDF to check your answers.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#065F46] mt-0.5" />
                  <p>Review the detailed solutions to understand the problem-solving approach.</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0891B2] mt-0.5" />
                  <p>Download the test PDF and read all instructions carefully.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0891B2] mt-0.5" />
                  <p>Complete the test within the time limit ({test.timeLimit} minutes).</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0891B2] mt-0.5" />
                  <p>Upload your completed work below for grading.</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Submission and Comments */}
        <Tabs defaultValue="submission" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submission" className="text-sm md:text-base">
              <Upload className="h-4 w-4 mr-2" />
              My Work
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-sm md:text-base">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submission">
            <TestSubmission testId={testId} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentSection testId={testId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
