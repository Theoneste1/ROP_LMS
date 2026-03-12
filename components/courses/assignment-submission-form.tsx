"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, X } from "lucide-react"

const submissionSchema = z.object({
  content: z.string().min(10, "Submission must be at least 10 characters"),
  file: z.instanceof(File).optional(),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

export function AssignmentSubmissionForm({
  assignmentId,
  courseSlug,
  initialContent,
  initialFileUrl,
  isUpdate = false,
}: {
  assignmentId: string
  courseSlug: string
  initialContent?: string
  initialFileUrl?: string | null
  isUpdate?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(initialFileUrl || null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: initialContent || "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
      setFilePreview(file.name)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  const onSubmit = async (data: SubmissionFormData) => {
    setLoading(true)
    try {
      let fileUrl = initialFileUrl || null

      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("assignmentId", assignmentId)

        const uploadResponse = await fetch("/api/assignments/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.error || "Failed to upload file")
        }

        const uploadResult = await uploadResponse.json()
        fileUrl = uploadResult.fileUrl
      }

      // Submit assignment
      const url = `/api/assignments/${assignmentId}/submissions`
      const method = isUpdate ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data.content,
          fileUrl: fileUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit assignment")
      }

      toast({
        title: "Success!",
        description: isUpdate
          ? "Submission updated successfully."
          : "Assignment submitted successfully.",
      })

      setLoading(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit assignment",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Your Submission *</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Enter your assignment submission here..."
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-sm text-muted-foreground">
          You can use HTML or Markdown formatting
        </p>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Upload File (Optional)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {filePreview && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <File className="h-4 w-4" />
              <span className="text-sm">{filePreview}</span>
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? isUpdate
            ? "Updating..."
            : "Submitting..."
          : isUpdate
          ? "Update Submission"
          : "Submit Assignment"}
      </Button>
    </form>
  )
}
