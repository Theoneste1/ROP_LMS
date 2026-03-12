"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Download, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface TestSubmissionProps {
  testId: string
}

interface Submission {
  id: string
  fileUrl: string
  fileName: string
  status: "PENDING" | "GRADED" | "RETURNED"
  score: number | null
  feedback: string | null
  submittedAt: Date
  gradedAt: Date | null
}

export function TestSubmission({ testId }: TestSubmissionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubmission()
    } else {
      setLoading(false)
    }
  }, [testId, session])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/submissions`)
      if (response.ok) {
        const data = await response.json()
        setSubmission(data.submission || null)
      }
    } catch (error) {
      console.error("Failed to fetch submission:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPG, PNG)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    setFilePreview(file.name)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("testId", testId)

      const response = await fetch(`/api/tests/${testId}/submissions`, {
        method: submission ? "PATCH" : "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: submission
            ? "Work resubmitted successfully"
            : "Work submitted successfully",
        })
        setSelectedFile(null)
        setFilePreview(null)
        fetchSubmission()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit work")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit work",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = () => {
    if (!submission) return null

    switch (submission.status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending for Marking
          </Badge>
        )
      case "GRADED":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Graded
          </Badge>
        )
      case "RETURNED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        )
      default:
        return null
    }
  }

  if (!session?.user?.id) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Please sign in to submit your work
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="text-center py-8 text-sm text-gray-500">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Submit Your Work</CardTitle>
        <CardDescription>
          Upload your completed test work. You can resubmit at any time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submission && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{submission.fileName}</span>
              </div>
              {getStatusBadge()}
            </div>
            <div className="text-xs text-gray-500">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </div>
            
            {submission.status === "PENDING" && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800">Pending for Marking</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Your submission is waiting for instructor review. You can resubmit at any time.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submission.status === "GRADED" && submission.score !== null && (
              <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Score:</span>
                  <span className="text-lg font-bold text-[#0891B2]">{submission.score}</span>
                </div>
                {submission.feedback && (
                  <div className="mt-2">
                    <span className="text-sm font-semibold">Feedback:</span>
                    <p className="text-sm text-gray-700 mt-1">{submission.feedback}</p>
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Graded on: {submission.gradedAt ? new Date(submission.gradedAt).toLocaleString() : "N/A"}
                </p>
              </div>
            )}

            {submission.status === "RETURNED" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800 mb-1">Returned for Resubmission</p>
                {submission.feedback && (
                  <p className="text-xs text-red-700">{submission.feedback}</p>
                )}
              </div>
            )}

            {submission.fileUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (submission.fileUrl) {
                    const link = document.createElement("a")
                    link.href = submission.fileUrl
                    link.download = submission.fileName || "submission.pdf"
                    link.target = "_blank"
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Current Submission
              </Button>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {submission 
                ? submission.status === "PENDING" 
                  ? "Resubmit Work (Currently Pending for Marking)"
                  : "Resubmit Work"
                : "Upload Your Work"}
            </label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
            {submission && submission.status === "PENDING" && (
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                ⚠️ Your current submission is pending marking. Uploading a new file will replace it.
              </p>
            )}
          </div>

          {filePreview && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0891B2]" />
                <span className="text-sm">{filePreview}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  setFilePreview(null)
                }}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full bg-[#0891B2] hover:bg-[#0891B2]/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading
              ? "Uploading..."
              : submission
              ? "Resubmit Work"
              : "Submit Work"}
          </Button>

          {submission && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                {submission.status === "PENDING" 
                  ? "Your work is pending for marking. You can resubmit anytime by uploading a new file above."
                  : submission.status === "GRADED"
                  ? "Your work has been graded. You can still resubmit if needed."
                  : "You can resubmit your work by uploading a new file above."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
