"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CourseStatusEnum, CourseStatus } from "@/types/prisma"

type Course = {
  id: string
  title: string
  slug: string
  status: CourseStatus
  instructor: {
    name: string | null
    email: string
  }
  _count: {
    enrollments: number
    lessons: number
  }
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses")
      const data = await response.json()
      if (response.ok) {
        setCourses(data.courses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (courseId: string, newStatus: CourseStatus) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Success!",
        description: "Course status updated successfully.",
      })

      fetchCourses()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Management</CardTitle>
        <CardDescription>
          Manage all courses in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {course.instructor.name || course.instructor.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      course.status === "PUBLISHED"
                        ? "default"
                        : course.status === "DRAFT"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span>Lessons: {course._count.lessons}</span>
                  <span className="ml-4">Students: {course._count.enrollments}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/courses/${course.slug}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Select
                  value={course.status}
                  onValueChange={(value: CourseStatus) =>
                    handleStatusChange(course.id, value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
