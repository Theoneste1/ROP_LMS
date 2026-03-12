// Prisma types - re-exported for use in components
// These match the Prisma schema definitions

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN"
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED"
export type LessonType = "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT"
export type SubmissionStatus = "PENDING" | "SUBMITTED" | "GRADED"

export const LessonTypeEnum = {
  VIDEO: "VIDEO",
  TEXT: "TEXT",
  QUIZ: "QUIZ",
  ASSIGNMENT: "ASSIGNMENT",
} as const

export const UserRoleEnum = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
} as const

export const CourseStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const

// Base types matching Prisma models
export type Course = {
  id: string
  title: string
  description: string | null
  slug: string
  status: CourseStatus
  instructorId: string
  createdAt: Date
  updatedAt: Date
}

export type Lesson = {
  id: string
  title: string
  description: string | null
  content: string | null
  videoUrl: string | null
  documentUrl: string | null
  documentName: string | null
  type: LessonType
  order: number
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export type Assignment = {
  id: string
  title: string
  description: string | null
  content: string | null
  maxScore: number
  dueDate: Date | null
  courseId: string
  instructorId: string
  createdAt: Date
  updatedAt: Date
}

export type Question = {
  id: string
  question: string
  type: string
  options: string | null
  correctAnswer: string
  points: number
  order: number
  quizId: string
  createdAt: Date
  updatedAt: Date
}

export type Quiz = {
  id: string
  title: string
  description: string | null
  passingScore: number
  timeLimit: number | null
  lessonId: string
  createdAt: Date
  updatedAt: Date
}

export type QuizAttempt = {
  id: string
  quizId: string
  userId: string
  score: number | null
  completed: boolean
  completedAt: Date | null
  createdAt: Date
}

export type Submission = {
  id: string
  assignmentId: string
  userId: string
  content: string
  score: number | null
  feedback: string | null
  status: SubmissionStatus
  submittedAt: Date | null
  gradedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type User = {
  id: string
  email: string
  name: string | null
  password: string | null
  role: UserRole
  image: string | null
  createdAt: Date
  updatedAt: Date
}
