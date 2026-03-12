import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRoleEnum, CourseStatusEnum, LessonTypeEnum } from '@/types/prisma'
import bcrypt from 'bcryptjs'

const UserRole = UserRoleEnum
const CourseStatus = CourseStatusEnum
const LessonType = LessonTypeEnum

export async function POST() {
  try {
    console.log('🌱 Starting seed data generation...')

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@rolms.rw' },
      update: {},
      create: {
        email: 'admin@rolms.rw',
        name: 'System Administrator',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    })
    console.log('✅ Created admin user:', admin.email)

    // Create Instructor Users
    const instructorPassword = await bcrypt.hash('instructor123', 10)
    const instructor1 = await prisma.user.upsert({
      where: { email: 'instructor1@rolms.rw' },
      update: {},
      create: {
        email: 'instructor1@rolms.rw',
        name: 'Dr. Jean Baptiste',
        password: instructorPassword,
        role: UserRole.INSTRUCTOR,
      },
    })
    console.log('✅ Created instructor:', instructor1.email)

    const instructor2 = await prisma.user.upsert({
      where: { email: 'instructor2@rolms.rw' },
      update: {},
      create: {
        email: 'instructor2@rolms.rw',
        name: 'Prof. Marie Claire',
        password: instructorPassword,
        role: UserRole.INSTRUCTOR,
      },
    })
    console.log('✅ Created instructor:', instructor2.email)

    // Create Student Users
    const studentPassword = await bcrypt.hash('student123', 10)
    const students = []
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.user.upsert({
        where: { email: `student${i}@rolms.rw` },
        update: {},
        create: {
          email: `student${i}@rolms.rw`,
          name: `Student ${i}`,
          password: studentPassword,
          role: UserRole.STUDENT,
        },
      })
      students.push(student)
      console.log(`✅ Created student ${i}:`, student.email)
    }

    // Create Course 1: Introduction to Olympiad Mathematics
    const course1 = await prisma.course.upsert({
      where: { slug: 'intro-olympiad-mathematics' },
      update: {},
      create: {
        title: 'Introduction to Olympiad Mathematics',
        description: 'A comprehensive introduction to mathematical problem-solving techniques used in Olympiad competitions. This course covers fundamental topics including number theory, algebra, geometry, and combinatorics.',
        slug: 'intro-olympiad-mathematics',
        status: CourseStatus.PUBLISHED,
        instructorId: instructor1.id,
      },
    })
    console.log('✅ Created course:', course1.title)

    // Create Lessons for Course 1
    const lesson1_1 = await prisma.lesson.create({
      data: {
        title: 'Introduction to Number Theory',
        description: 'Learn the basics of number theory and divisibility',
        content: `# Introduction to Number Theory

Number theory is one of the most fundamental branches of mathematics, dealing with the properties and relationships of integers.

## Key Concepts

1. **Divisibility**: Understanding when one number divides another
2. **Prime Numbers**: Numbers divisible only by 1 and themselves
3. **GCD and LCM**: Greatest Common Divisor and Least Common Multiple
4. **Modular Arithmetic**: Working with remainders

## Example Problem

Find all positive integers n such that n² + 1 is divisible by n + 1.

**Solution**: Use polynomial division and divisibility properties.`,
        type: LessonType.TEXT,
        order: 1,
        courseId: course1.id,
      },
    })

    const lesson1_2 = await prisma.lesson.create({
      data: {
        title: 'Basic Algebra Techniques',
        description: 'Essential algebraic manipulation skills',
        content: `# Basic Algebra Techniques

Algebra is the foundation of mathematical problem-solving.

## Topics Covered

- Factorization
- Completing the square
- Vieta's formulas
- Symmetric polynomials`,
        type: LessonType.TEXT,
        order: 2,
        courseId: course1.id,
      },
    })

    const lesson1_3 = await prisma.lesson.create({
      data: {
        title: 'Number Theory Quiz',
        description: 'Test your understanding of number theory',
        type: LessonType.QUIZ,
        order: 3,
        courseId: course1.id,
      },
    })

    // Create Quiz for Lesson 1_3
    const quiz1 = await prisma.quiz.create({
      data: {
        title: 'Number Theory Assessment',
        description: 'Test your knowledge of number theory fundamentals',
        timeLimit: 30, // 30 minutes
        passingScore: 70,
        lessonId: lesson1_3.id,
      },
    })

    // Create Questions for Quiz 1
    await prisma.question.createMany({
      data: [
        {
          question: 'What is the greatest common divisor of 48 and 72?',
          type: 'multiple_choice',
          options: JSON.stringify(['12', '24', '48', '72']),
          correctAnswer: '24',
          points: 10,
          order: 1,
          quizId: quiz1.id,
        },
        {
          question: 'How many prime numbers are there between 1 and 20?',
          type: 'multiple_choice',
          options: JSON.stringify(['6', '7', '8', '9']),
          correctAnswer: '8',
          points: 10,
          order: 2,
          quizId: quiz1.id,
        },
        {
          question: 'True or False: Every even number greater than 2 can be expressed as the sum of two primes.',
          type: 'true_false',
          options: null,
          correctAnswer: 'True',
          points: 15,
          order: 3,
          quizId: quiz1.id,
        },
        {
          question: 'What is the least common multiple of 12 and 18?',
          type: 'short_answer',
          options: null,
          correctAnswer: '36',
          points: 15,
          order: 4,
          quizId: quiz1.id,
        },
      ],
    })

    console.log('✅ Created quiz with questions for course 1')

    // Create Assignment for Course 1
    const assignment1 = await prisma.assignment.create({
      data: {
        title: 'Number Theory Problem Set',
        description: 'Solve the following problems and submit your solutions.',
        maxScore: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        courseId: course1.id,
        instructorId: instructor1.id,
      },
    })
    console.log('✅ Created assignment for course 1')

    // Create Course 2: Advanced Geometry
    const course2 = await prisma.course.upsert({
      where: { slug: 'advanced-geometry' },
      update: {},
      create: {
        title: 'Advanced Geometry for Olympiads',
        description: 'Master geometric problem-solving techniques including triangle geometry, circle properties, and coordinate geometry.',
        slug: 'advanced-geometry',
        status: CourseStatus.PUBLISHED,
        instructorId: instructor2.id,
      },
    })
    console.log('✅ Created course:', course2.title)

    // Create Lessons for Course 2
    await prisma.lesson.createMany({
      data: [
        {
          title: 'Triangle Geometry Fundamentals',
          description: 'Properties of triangles and their applications',
          content: '# Triangle Geometry\n\nLearn about triangle properties, centers, and theorems.',
          type: LessonType.TEXT,
          order: 1,
          courseId: course2.id,
        },
        {
          title: 'Circle Properties',
          description: 'Understanding circles and their relationships',
          content: '# Circle Properties\n\nExplore theorems related to circles.',
          type: LessonType.TEXT,
          order: 2,
          courseId: course2.id,
        },
      ],
    })

    // Enroll students in courses
    for (const student of students.slice(0, 3)) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course1.id,
        },
      })
      console.log(`✅ Enrolled ${student.name} in ${course1.title}`)
    }

    for (const student of students.slice(0, 2)) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course2.id,
        },
      })
      console.log(`✅ Enrolled ${student.name} in ${course2.title}`)
    }

    // Create some progress records
    if (students.length > 0 && lesson1_1 && course1) {
      // Find enrollment for this student and course
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: students[0].id,
          courseId: course1.id,
        },
      })
      
      if (enrollment) {
        await prisma.progress.create({
          data: {
            userId: students[0].id,
            lessonId: lesson1_1.id,
            enrollmentId: enrollment.id,
            completed: true,
            completedAt: new Date(),
          },
        })
        console.log(`✅ Created progress record for ${students[0].name}`)
      }
    }

    console.log('\n🎉 Seed data generation completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        admin: admin.email,
        instructors: [instructor1.email, instructor2.email],
        students: students.map(s => s.email),
        courses: [course1.title, course2.title],
      },
    })
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
